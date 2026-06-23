# PLIA 2 — Arquitetura Técnica da Solução

## 1. Visão Geral

O PLIA 2 é a evolução da plataforma da Plongê, desenhada para transformar conhecimento operacional disperso (entrevistas, conversas com clientes, CVs de candidatos) em inteligência consultável e proprietária da empresa.

A arquitetura é headless-first, horizontalmente escalável, e independente de fornecedor (sem lock-in Microsoft). O sistema é composto por uma API GraphQL sobre Rails, um frontend desacoplado em Next.js, armazenamento de arquivos em S3, banco de dados PostgreSQL com pgvector para busca vetorial, e workers assíncronos para processamento de embeddings.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| API | Ruby on Rails (API mode) | Produtividade alta para dev solo, ecossistema maduro para BDD, convenção forte |
| GraphQL | graphql-ruby (code-first) | API headless consumível por múltiplas superfícies, type-safety via codegen |
| Banco de Dados | PostgreSQL + pgvector | Transacional + analytics (materialized views) + busca vetorial numa só instância |
| Fila de Jobs | Sidekiq + Redis | Jobs assíncronos, cron scheduling, retry com backoff |
| Frontend | Next.js + Apollo Client | SPA com roteamento robusto, integração nativa com GraphQL, codegen de tipos |
| Armazenamento | AWS S3 (via Active Storage) | CVs, transcrições de entrevistas, gravações, documentos |
| Embeddings | OpenAI Embeddings API (fase 1) → Worker Python local (fase 2+) | Custo baixo no MVP, migração pra modelo local quando houver volume |
| CDN | CloudFront (fase 2+) | Servir arquivos estáticos com baixa latência |
| Infra | AWS (sa-east-1 São Paulo) | Proximidade geográfica, compliance de dados no Brasil |

---

## 3. Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                         │
│                     Apollo Client + GraphQL Codegen                 │
│                         Direct Upload → S3                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ GraphQL (HTTPS)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API (Ruby on Rails)                          │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐   │
│  │  GraphQL    │  │  Controllers │  │  Services                 │   │
│  │  Resolvers  │  │  (REST)      │  │  - LlmQueryService        │   │
│  │             │  │              │  │  - ConfidentialDataMasker │   │
│  │             │  │              │  │  - EmbeddingService       │   │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐   │
│  │  Active Storage  │  │  Sidekiq (Jobs + Cron)                 │   │
│  │  (S3 backend)    │  │  - GenerateEmbeddingsJob               │   │
│  │                  │  │  - RefreshMaterializedViewsJob         │   │
│  │                  │  │  - CleanupOldChunksJob                 │   │
│  └──────────────────┘  └────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   PostgreSQL     │  │    Redis     │  │   AWS S3     │
│                  │  │              │  │              │
│  - Transacional  │  │  - Sidekiq   │  │  - CVs       │
│  - Mat. Views    │  │    queues    │  │  - Entrev.   │
│  - pgvector      │  │  - Cache     │  │  - Gravações │
│  - Audit logs    │  │              │  │  - Docs      │
└──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 4. Modelo de Dados (Core)

### 4.1 Entidades Principais

```
companies (clientes)
├── projects (projetos por cliente)
│   ├── interviews (entrevistas realizadas)
│   │   ├── interview_feedbacks (feedback por entrevista)
│   │   └── documents (arquivos anexados)
│   └── candidates (candidatos vinculados)
│       └── documents (CVs, certificações)
└── conversations (registros de conversa com o cliente)

users (recrutadores/operadores da Plongê)
├── query_audit_logs (auditoria de consultas AI)
└── user_roles (controle de acesso por cliente/projeto)
```

### 4.2 Tabelas de RAG

```sql
-- Registro de cada documento processável
documents
  id, documentable_type, documentable_id,
  document_type (interview, conversation, cv),
  company_id, project_id, candidate_id,
  created_at, processed_at

-- Chunks com embeddings para busca vetorial
document_chunks
  id, document_id (FK),
  chunk_index, chunk_text,
  embedding vector(1536),   -- pgvector
  -- campos desnormalizados para filtro rápido:
  company_id, project_id, created_at
```

### 4.3 Materialized Views (Analytics)

```sql
-- Skills mais pedidas por cliente
CREATE MATERIALIZED VIEW mv_skills_by_company AS
  SELECT company_id, skill, COUNT(*) as demand_count
  FROM interviews
  JOIN interview_skills ON ...
  GROUP BY company_id, skill;

-- Taxa de conversão por projeto
CREATE MATERIALIZED VIEW mv_conversion_by_project AS
  SELECT project_id,
         COUNT(*) FILTER (WHERE status = 'approved') as approved,
         COUNT(*) as total,
         ROUND(COUNT(*) FILTER (WHERE status = 'approved')::numeric / COUNT(*), 2) as rate
  FROM interviews
  GROUP BY project_id;

-- Feedback agregado (padrões de rejeição)
CREATE MATERIALIZED VIEW mv_rejection_patterns AS
  SELECT company_id, feedback_category, COUNT(*) as occurrences
  FROM interview_feedbacks
  WHERE sentiment = 'negative'
  GROUP BY company_id, feedback_category;
```

Refresh via Sidekiq Cron (a cada 15 minutos ou sob demanda).

---

## 5. Feature de Inteligência (RAG)

### 5.1 Tipos de Consulta

A feature de chat contextual suporta três categorias de consulta, cada uma com tratamento de segurança diferente:

**Queries Estruturadas (sem LLM)**
Executam diretamente no PostgreSQL. Representam ~70% das consultas.

- "Quantos projetos fizemos com Mercado Livre?"
- "Qual a taxa de conversão por skill nos últimos 3 meses?"
- "Skills mais pedidas no último trimestre?"

**Queries com Sumarização (LLM com anonimização)**
Buscam dados via SQL, anonimizam, e enviam pra LLM gerar resumo em linguagem natural. Representam ~20% das consultas.

- "Resuma os feedbacks positivos do último mês"
- "Qual é o perfil ideal baseado nas últimas aprovações?"

**Queries Sensíveis (LLM local ou análise em código)**
Informação estratégica/confidencial que não deve sair da infraestrutura. Representam ~10% das consultas.

- "Como o cliente X está estruturando sua operação baseado nas entrevistas?"
- "Qual a estratégia de contratação que identificamos neste cliente?"

### 5.2 Fluxo de Query

```
Usuário faz pergunta + seleciona escopo (cliente, projeto, datas)
    │
    ▼
Parser classifica a query:
    ├─ Estruturada → SQL direto → resposta formatada
    ├─ Sumarização → SQL → anonimização → LLM externa → resposta
    └─ Sensível   → SQL → análise local (código ou LLM local) → resposta
```

### 5.3 Pipeline de Embeddings

```
Documento criado (upload de CV, transcrição salva)
    │
    ▼
Rails cria registro em `documents` + upload S3 (Active Storage)
    │
    ▼
Sidekiq enfileira GenerateEmbeddingsJob
    │
    ▼
Job chama OpenAI Embeddings API (fase 1) ou worker Python local (fase 2+)
    │
    ▼
Texto é chunkado por tipo:
  - Entrevistas → por turno de fala
  - Conversas → por grupo de mensagens
  - CVs → por seção
    │
    ▼
Embeddings gerados → escritos em `document_chunks` com metadados
```

### 5.4 Busca Vetorial com Filtros

```sql
-- Exemplo: "feedback sobre candidatos de backend no Mercado Livre"
SELECT chunk_text, 1 - (embedding <=> $query_vector) AS similarity
FROM document_chunks
WHERE company_id = :mercado_livre_id
  AND created_at >= NOW() - INTERVAL '6 months'
ORDER BY embedding <=> $query_vector
LIMIT 15;
```

O WHERE clause é montado dinamicamente pelo escopo selecionado no frontend. A busca vetorial roda apenas dentro do subconjunto filtrado.

---

## 6. Segurança e Compliance

### 6.1 Camadas de Proteção

**Camada 1 — Controle de Acesso (RBAC)**
Cada usuário só acessa dados de clientes/projetos atribuídos a ele. O escopo é aplicado via SQL no backend — não depende do frontend.

```ruby
scope = { company_id: current_user.client_ids }
# Query vetorial só roda dentro desse escopo
```

**Camada 2 — Anonimização antes de LLM externa**
Dados pessoais (CPF, email, telefone, salário) e informações confidenciais (nomes de clientes, candidatos, projetos) são mascarados antes de envio.

```ruby
class ConfidentialDataMasker
  # Substitui CPFs, emails, telefones por tokens
  # Substitui nomes de clientes, candidatos, projetos por tokens
  # Mapeia tokens localmente para de-tokenização na resposta
end
```

**Camada 3 — Segregação por sensibilidade**
Queries sobre informação estratégica de clientes nunca são enviadas pra LLM externa. Processamento local via código Rails ou LLM local (Mistral 7B via RunPod).

**Camada 4 — DPA com provedores de LLM**
Contrato de Data Processing Agreement assinado com Anthropic/OpenAI garantindo: dados não usados para treinamento, retenção limitada, direito de auditoria.

**Camada 5 — Audit Trail**
Toda consulta é registrada com: usuário, escopo aplicado, quantidade de chunks recuperados, timestamp, IP. Rastreabilidade completa.

**Camada 6 — Retenção e Limpeza**
Chunks de texto bruto deletados após período configurável (ex: 90 dias). Embeddings permanecem (não são reversíveis para texto original).

### 6.2 O que nunca sai da infraestrutura

- Nomes reais de clientes e candidatos
- Informação estratégica/competitiva de clientes
- Termos de contrato ou valores específicos
- Detalhes de feedback que permitam reidentificação
- Qualquer dado que possa violar NDA com clientes

### 6.3 Compliance LGPD

- Dados pessoais de candidatos armazenados com base legal definida
- Processamento por terceiros (LLM) coberto por DPA
- Direito de exclusão implementável via soft delete + cleanup job
- Dados hospedados em sa-east-1 (São Paulo) para soberania territorial

---

## 7. Infraestrutura AWS

### 7.1 Fases de Crescimento

| Componente | Fase 0 (Dev) | Fase 1 (Prod Mínima) | Fase 2 (Tração) | Fase 3 (Escala) |
|---|---|---|---|---|
| EC2 (Rails API) | Localhost | 1x t3.small ($20) | 2x t3.small + ALB ($56) | 4-6x t3.small + ALB ($100+) |
| RDS PostgreSQL | Local | db.t3.micro ($25) | db.t3.small ($60) | db.t3.large + replica ($150+) |
| ElastiCache Redis | Local | cache.t3.micro ($12) | cache.t3.small ($25) | cache.t3.medium ($50) |
| S3 | Local disk | 100GB ($12) | 500GB ($41) | 1TB+ ($75+) |
| Workers (Sidekiq) | N/A | Inline | 1x t3.small ($20) | 2-4x t3.small ($40+) |
| Embeddings | N/A | OpenAI API (~$15) | OpenAI API (~$30) | Worker local + GPU |
| CloudFront | N/A | N/A | Sim ($20) | Sim ($40+) |
| NAT Gateway | N/A | $32 | $32 | $32 |
| **Custo mensal** | **R$0** | **~$130 (~R$650)** | **~$300 (~R$1.500)** | **~$700 (~R$3.500)** |
| **MAU suportado** | Dev | Até 10k | 10k–100k | 100k+ |
| **RPS sustentado** | <10 | 50–100 | 200–500 | 1.000+ |

### 7.2 Estratégia de Escala

- **API**: Stateless, escala horizontal adicionando instâncias EC2 atrás do ALB
- **Workers**: Frota separada da API, escala independente por demanda de jobs
- **PostgreSQL**: PgBouncer para connection pooling → read replicas para analytics → vertical scaling do RDS
- **Redis**: Instância dedicada, sem persistência (é só broker de fila)
- **S3**: Escala ilimitada nativamente

---

## 8. Cron Jobs

| Job | Frequência | Descrição |
|---|---|---|
| RefreshMaterializedViewsJob | A cada 15 min | Atualiza materialized views de analytics |
| GenerateEmbeddingsJob | Sob demanda (event-driven) | Processa novos documentos e gera embeddings |
| CleanupOldChunksJob | Diário | Remove chunks de texto bruto após período de retenção |
| AuditLogCleanupJob | Semanal | Compacta/arquiva logs de auditoria antigos |
| HealthCheckJob | A cada 5 min | Verifica saúde do PostgreSQL, Redis, S3 |

Todos gerenciados via `sidekiq-cron` dentro do Rails. Jobs pesados rodam em workers separados da API (Fase 2+).

---

## 9. Diferenciais Estratégicos do PLIA 2

### 9.1 Memória Institucional
Conhecimento sobre clientes, candidatos e projetos deixa de depender de pessoas individuais e vira ativo permanente da empresa. Cada interação alimenta o sistema e melhora consultas futuras — efeito composto ao longo do tempo.

### 9.2 Reuso de Pipeline (Cross-selling)
Candidatos avaliados para um projeto podem ser automaticamente recomendados para outros projetos/clientes via busca de similaridade vetorial. Margem invisível que quase nenhuma staffing captura.

### 9.3 Compliance como Diferencial Comercial
Processamento de dados em infraestrutura própria, sem exposição a LLMs de terceiros para dados sensíveis. Argumento concreto em procurement de clientes enterprise que exigem compliance de dados de fornecedores.

### 9.4 Inteligência que Compõe
A vantagem competitiva cresce com o uso. Dados do ano 1 melhoram decisões do ano 2. Um concorrente que copie a tecnologia não consegue replicar o histórico acumulado. Moat baseado em dado proprietário.

### 9.5 Quebra da Linearidade Headcount × Receita
Recrutadores aumentados por AI processam mais volume com mais qualidade. O sistema reduz tempo de preparação (de 30 min revisando anotações para 2 min de chat) e melhora taxa de conversão (melhor match = mais aprovações por envio).

---

## 10. Decisões Técnicas e Trade-offs

| Decisão | Alternativa Descartada | Motivo |
|---|---|---|
| Rails em vez de NestJS | NestJS + Prisma | Dev solo com background em Rails produz mais rápido; mercado de devs Rails menor mas mais sênior |
| pgvector em vez de Qdrant | Qdrant dedicado | Simplifica infra mantendo tudo no PostgreSQL; migra para Qdrant se volume de vetores ultrapassar dezenas de milhões |
| GraphQL em vez de REST puro | REST + OpenAPI | API headless para múltiplas superfícies; type-safety end-to-end via codegen |
| Sidekiq em vez de BullMQ | BullMQ + Node workers | Ecossistema Rails nativo, UI de monitoramento, maturidade superior |
| OpenAI Embeddings API (fase 1) | Sentence-transformers local | Evita sobrecarregar t3.small; custo baixo no MVP (~$15/mês) |
| Segregação de queries por sensibilidade | Masking universal + LLM pra tudo | Masking nem sempre preserva contexto útil; queries sensíveis não devem sair da infra independente de anonimização |
| AWS sa-east-1 | Railway / Render | Compliance de dados no Brasil; controle total de infra; custo previsível em escala |

---

*Documento gerado em abril de 2026. Versão 1.0.*
