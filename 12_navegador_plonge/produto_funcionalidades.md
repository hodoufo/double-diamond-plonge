# Navegador Plongê — Produto e funcionalidades (PRD)

Documento de referência de produto. Complementa `[mapa_de_telas.md](mapa_de_telas.md)` (UI), `[modelagem.md](modelagem.md)` (dados) e `[arquitetura_tecnica_plia2.md](arquitetura_tecnica_plia2.md)` (implementação).

---

## Glossário de nomes


| Termo                                | Uso                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Navegador** / **Navegador Plongê** | Nome do **produto** (software interno da Plongê).                                                                                                                                      |
| **Plia**                             | Nome da **camada de IA** (LLM, RAG, sugestões, busca semântica). Não é o nome do sistema.                                                                                              |
| **Plia v1**                          | Legado (Bluecore). Sistema antigo; dados serão migrados.                                                                                                                               |
| **Superfície Plia**                  | Conjunto de UI onde a pessoa interage com a Plia (resultados, histórico de troca).                                                                                                     |
| **Input Plia (composer)**            | Campo de **chat / busca** da Plia, **sempre fixo na parte inferior da tela**; thread e resultados ficam acima.                                                                         |
| **Conta**                            | Organização cliente da Plongê (equivale ao que o módulo **Empresas** mostra no grafo: mesma base de dados; o grafo é visão de relacionamentos sobre contas).                           |
| **ATS (no Navegador)**               | Sistema de acompanhamento de candidatos e processos de **seleção** da Plongê: o Navegador **é** o ATS interno (projetos, etapas, candidatos, entregáveis), além de CRM e conhecimento. |
| **i18n**                             | Internacionalização: **interface** e mensagens de sistema em vários idiomas; **locale** escolhido pelo utilizador ou pelo browser (fallback configurável).                             |


---

## 1. Resumo executivo

O **Navegador Plongê** é o **CRM operacional**, a **base de conhecimento** e o **ATS (Applicant Tracking System) interno** da Plongê: contatos, contas, negócios, conversas, **projetos e candidatos** (funil de seleção), e material de conhecimento, com **analytics** e **Plia** para reduzir retrabalho e acelerar decisões. A **Plia** não substitui o julgamento humano: propõe, resume e recupera informação dentro de políticas de dados e confirmação onde necessário.

Em **versões futuras (v2+ de integração)**, o produto pode **sincronizar ou acoplar** a ATS **dos clientes** (ex.: Gupy, Greenhouse, SuccessFactors) para alinhar o trabalho da Plongê ao processo de contratação no lado do cliente — ver secção 7.

---

## 2. Contexto (síntese)

- Processo validado com Google Forms (conversas e contatos); falta **ferramenta de trabalho** integrada.
- Legado **Plia v1** sem domínio interno nem acesso pleno a banco/infra; decisão de **construir de novo** sob controle da Plongê.
- Objetivo: **fonte única da verdade** operacional e memória institucional consultável (incluindo RAG conforme arquitetura).

Detalhes narrativos: `[storytelling.md](storytelling.md)`.

---

## 3. Personas e objetivos


| Persona                     | Objetivo principal                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Consultor(a) / recrutamento | Registar interações, avançar negócios e **processos de seleção (ATS)** com contexto à mão. |
| Comercial                   | Visibilidade de funil, próximos passos e tarefas.                                          |
| Operação / coordenação      | Configurar projetos, etapas e acompanhar entregáveis.                                      |
| Admin / dados               | Listas, permissões e qualidade de cadastro (evolução).                                     |


---

## 4. Princípios de UX

### 4.1 AppShell


| Zona                                         | Desktop                                            | Mobile                                                                                                                                 |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Navegação de **módulos** (Home, Contatos, …) | Rail **à esquerda**                                | **Barra inferior** (ou equivalente)                                                                                                    |
| **Conteúdo rico**                            | Centro (listas, gráficos, editor, pipeline, grafo) | Mesma área principal                                                                                                                   |
| **Painel de detalhes** (inspector)           | **À direita**, redimensionável quando aplicável    | **Drawer** / bottom sheet                                                                                                              |
| **Superfície Plia**                          | Histórico e resultados **acima** do composer       | Idem                                                                                                                                   |
| **Composer Plia**                            | **Sempre na borda inferior da viewport**           | Empilhar com a barra de módulos (composer imediatamente **acima** da navegação de módulos, ou padrão visual único a refinar no design) |


Regra: o **menu do Navegador** não compete com a **Superfície Plia** — são camadas diferentes (navegação global vs interação com IA).

### 4.2 Acessibilidade e performance (alvo)

- PWA (`[IMG_3400](telas_sugeridas/IMG_3400.jpeg)`).
- Vistas pesadas (grafo, dashboards): carregamento progressivo e metas de tempo a definir em implementação.

### 4.3 Internacionalização (i18n)

- O produto deve suportar **vários idiomas** na **UI** (rótulos, menus, validações, mensagens de erro, emails transacionais onde aplicável) através de **i18n** — catálogos por locale (ex. `pt-BR`, `en-US`), com **pt-BR** como idioma padrão inicial.
- **Conteúdo de negócio** (notas de conversa, nomes de empresas, CVs, páginas de conhecimento) permanece no idioma em que foi registado; não é traduzido automaticamente salvo funcionalidade explícita futura.
- **Plia:** preferência para responder no **locale ativo** da sessão quando fizer sentido tecnicamente (política de modelo e custo na implementação).
- **RF-I01** — Seletor de idioma (definições ou deteção inicial via `Accept-Language`) persiste preferência do utilizador.

---

## 5. Escopo por módulo

### 5.1 Home (dashboard)

- **Funil comercial** (visão agregada).
- **Projetos rodando** (lista).
- **Atalhos:** + Contato, + Negócio, + Conhecimento.
- **Próximas tarefas** (widget).
- **RF-H01** — Exibir resumo de pipeline e projetos no escopo do utilizador (RBAC).
- **RF-H02** — Atalhos criam rascunho ou abrem fluxo de criação no módulo alvo.

### 5.2 Contatos

- Lista mestre + **inspector:** pessoa, tipo de relação (multi-valor), integrações, WhatsApp, histórico de conversas, tarefas.
- **+ Conversa futura** agendada.
- Segmentação por **faixa de relacionamento** (taxonomia canônica alinhada a `[modelagem.md](modelagem.md)` — ver secção 9).
- **RF-C01** — CRUD de contato com vínculo a conta(s) e negócio opcional.
- **RF-C02** — Lusha: abrir enriquecimento conforme integração disponível (MVP: link/fluxo mínimo documentado no PRD de integrações).
- **RF-C03** — Plia no contexto do contato: perguntas e sugestões com escopo ao registo selecionado.

### 5.3 Empresas (grafo)

- **Uma base de Contas**: o grafo (indústrias, pai/filho, grupo) é **visão** sobre relacionamentos entre contas — ver `[modelagem.md](modelagem.md)`.
- Inspector: pai, filhos, conselho, executivos, outros contatos.
- **RF-E01** — Navegação no grafo com seleção e painel de detalhe.
- **RF-E02** — Busca / comando (evolução: linha de comando unificada com Plia).

### 5.4 Negócios

- Centro: gráficos (série, funil, barras).
- Inspector: estágio, empresa (conta), pessoas-chave, conversas, ligação ao projeto, tarefas.
- **RF-N01** — Estados e probabilidades alinhados ao modelo de negócio (`[modelagem.md](modelagem.md)`).
- **RF-N02** — Transição de estágio com auditoria.

### 5.5 Conversas

- Lista tipo **excerpts** + filtros (ex.: comercial, “meus”).
- **+ Conversa futura**.
- Inspector: título, pessoa, empresa, contexto (projeto, relacionamento, comercial).
- Ações assistidas: **Gera fup?**, **Gera Negócio?** (confirmação humana antes de gravar efeitos laterais).
- **RF-V01** — CRUD conversa ligada a contato, conta e opcionalmente negócio.
- **RF-V02** — Plia sugere follow-up e rascunhos; utilizador confirma.

### 5.6 Projetos e candidatos (ATS interno Plongê)

Este módulo é o **núcleo do ATS** da empresa: pipeline de projeto de seleção, listagem e tratamento de **candidatos**, entregáveis e tarefas — independentemente de o cliente usar outro ATS no seu lado.

- Pipeline: **Projeto** (docs, conhecimento, conversas) → **Candidatos** → **Entregáveis** (shortlist, estudos) → **Tarefas** (calendário).
- Contexto (dropdown), calendário, **Faturamento**, **Config** (etapas).
- **V2** (backlog): link para cliente externo.
- **RF-P01** — Projeto vinculado a conta; participantes e documentos.
- **RF-P02** — Etapas configuráveis (tipos de etapa).
- **RF-P03 (visão v2 integrações)** — Opcionalmente associar um projeto a uma **vaga ou processo** espelhado num ATS do cliente (quando integração existir).

### 5.7 Conhecimento

- Editor de página (rich text) + painel wiki/metadados.
- Plia: contexto do documento, enriquecimento web, escrita assistida, hashtags incentivadas.
- **RF-K01** — Documentos versionados ou com histórico mínimo (a detalhar na implementação).
- **RF-K02** — Integração com pipeline RAG (`[arquitetura_tecnica_plia2.md](arquitetura_tecnica_plia2.md)`).

---

## 6. Capacidades da Plia (matriz resumida)


| Módulo       | Busca / RAG              | Geração de texto    | Ações propostas                        |
| ------------ | ------------------------ | ------------------- | -------------------------------------- |
| Home         | Resumos globais (escopo) | —                   | Sugestão de próximos passos            |
| Contatos     | Contexto do contato      | Mensagens / resumos | Enriquecimento (com política de dados) |
| Empresas     | —                        | —                   | Insights sobre conta (escopo)          |
| Negócios     | Dados do negócio         | —                   | Sugestão de próximo estágio (advisory) |
| Conversas    | Histórico                | Follow-up, minuta   | Criar tarefa / rascunho de negócio     |
| Projetos     | Docs do projeto          | —                   | Resumo de status                       |
| Conhecimento | Wiki + corpus            | Escrita assistida   | Hashtags / estrutura                   |


Políticas de **queries estruturadas vs sensíveis** e anonimização: ver secção 5–6 da arquitetura técnica.

---

## 7. Integrações (intenção de produto)


| Integração                | MVP sugerido (doc)                                                           | Evolução                                                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lusha**                 | Abrir fluxo / enriquecer campo controlado                                    | Sync batch                                                                                                                                                                                                                                                         |
| **WhatsApp**              | Link / deep link + registo manual da conversa                                | Integração mensagens                                                                                                                                                                                                                                               |
| **LinkedIn / extensão**   | Captura para projeto/candidato (`[IMG_3400](telas_sugeridas/IMG_3400.jpeg)`) | Workflow completo                                                                                                                                                                                                                                                  |
| **Calendário**            | Tarefas e milestones                                                         | Sync bidirecional                                                                                                                                                                                                                                                  |
| **ATS de clientes (v2+)** | Não no MVP                                                                   | Conectores para **Gupy**, **Greenhouse**, **SAP SuccessFactors** (ou outros): escopo exato — sincronização de vagas/candidatos/estados, só leitura vs bidirecional, webhooks — a definir por integração; requisitos legais (DPA com cliente e com fornecedor ATS). |


**Nota:** O Navegador continua sendo o **sistema de trabalho da Plongê**; integrações com ATS de terceiros servem para **reduzir cópia manual e desalinhamento** com o processo do cliente, não para substituir o ATS interno.

---

## 8. Requisitos não funcionais

- **PWA**, deploy conforme stack (Next + API).
- **i18n**: front Next com biblioteca de traduções e rotas ou namespaces por locale (detalhe técnico em `[arquitetura_tecnica_plia2.md](arquitetura_tecnica_plia2.md)`); backend com mensagens parametrizáveis por locale quando gerar texto de sistema (notificações, exports rotulados).
- **LGPD**: retenção, exclusão, DPA com fornecedores LLM (arquitetura).
- **Observabilidade**: erros (ex. Sentry), conforme diagrama de stack nos rabiscos.

---

## 9. Taxonomia de relacionamento do contato

Unificação em documentação:


| Origem                                 | Valores                                                    |
| -------------------------------------- | ---------------------------------------------------------- |
| `[modelagem.md](modelagem.md)` (atual) | fria, morna, quente, cliente                               |
| Wireframes (`IMG_3394`)                | Base, Ex cliente, Cliente, CS, Candidato, A ser trabalhado |


**Decisão de produto para próxima revisão:** mapear wireframe → valores canónicos (tags multi-valor ou enum estendido) sem perder filtros da operação. Manter **multi-valor** onde o rabisco indica.

---

## 10. Fases (produto / dados)


| Fase                           | Conteúdo documentado                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **MVP dados**                  | Conta, Contato, Negócio, Conversa (substituir forms) — núcleo de `[modelagem.md](modelagem.md)`.          |
| **Fase 2**                     | Projetos/candidatos (ATS interno) completos, RAG pleno, integrações operacionais (Lusha, WhatsApp, etc.). |
| **v2 integrações ATS cliente** | Conectores com **Gupy**, **Greenhouse**, **SuccessFactors** (prioridade e roadmap comercial a definir).   |


Ajustável após validação comercial; este PRD permite marcar **TBD** em integrações sensíveis.

---

## 11. Matriz de rastreabilidade (alto nível)


| Área           | Wireframes | Modelagem                              | Arquitetura                              |
| -------------- | ---------- | -------------------------------------- | ---------------------------------------- |
| Dashboard      | `IMG_3393` | Tarefas (extensão), negócios agregados | Materialized views, API                  |
| Contatos       | `IMG_3394` | Contato, Conversa                      | GraphQL, RBAC                            |
| Negócios       | `IMG_3395` | Negócio                                | Analytics SQL                            |
| Projetos / ATS | `IMG_3396` | projects, candidates, documents        | Jobs, S3; futuro: conectores ATS cliente |
| Conhecimento   | `IMG_3397` | documents, chunks                      | Embeddings, Sidekiq                      |
| Conversas      | `IMG_3398` | Conversa                               | RAG opcional                             |
| Empresas       | `IMG_3399` | Conta + grafo                          | Graph queries                            |
| Stack          | `IMG_3400` | —                                      | Infra AWS                                |


---

*Versão 1.2 — maio de 2026. Inclui requisitos de i18n.*