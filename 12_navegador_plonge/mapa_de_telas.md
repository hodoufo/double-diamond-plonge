# Mapa de telas — Navegador Plongê

Referência cruzada com wireframes em [`telas_sugeridas/`](telas_sugeridas/) e requisitos em [`produto_funcionalidades.md`](produto_funcionalidades.md).

## Glossário rápido

**Superfície Plia** — UI da IA. **Composer** — input chat/busca **sempre na parte inferior** da tela; conteúdo da troca acima.

## AppShell

| Zona | Desktop | Mobile |
|------|---------|--------|
| Navegação módulos | Esquerda | Inferior |
| Conteúdo | Centro | Centro |
| Detalhe | Direita (inspector) | Drawer / sheet |
| Composer Plia | Inferior (viewport) | Inferior (coordenar com barra de módulos) |

---

## Inventário por imagem

| Arquivo | Módulo | Conteúdo central | Painel / ações | Plia / integrações |
|---------|--------|------------------|----------------|-------------------|
| [`IMG_3393.jpeg`](telas_sugeridas/IMG_3393.jpeg) | Home | Funil pipe comercial, lista **Projetos rodando** | + Contato, + Negócio, + Conhecimento; **Próximas tarefas** | — |
| [`IMG_3394.jpeg`](telas_sugeridas/IMG_3394.jpeg) | Contatos | Lista | + Conversa futura; card Pessoa; Lusha, WhatsApp, conversas, tarefas; faixas de relação | Superfície Plia (rabisco lateral → composer inferior na implementação) |
| [`IMG_3395.jpeg`](telas_sugeridas/IMG_3395.jpeg) | Negócios | Gráficos (linha, funil, barras) | Card negócio, estágio, empresa, pessoas-chave, conversão, projeto, tarefas | Plia |
| [`IMG_3396.jpeg`](telas_sugeridas/IMG_3396.jpeg) | Projetos e candidatos (**ATS** Plongê) | Pipeline 4 etapas; calendário; Contexto | Faturamento; Config projeto | Plia |
| [`IMG_3397.jpeg`](telas_sugeridas/IMG_3397.jpeg) | Conhecimento | Editor de página | Painel wiki | Plia: contexto, web, escrita IA, hashtags |
| [`IMG_3398.jpeg`](telas_sugeridas/IMG_3398.jpeg) | Conversas | Excerpts; + Conversa futura | Inspector conversa; Gera fup / Gera negócio | Filtros; Plia |
| [`IMG_3399.jpeg`](telas_sugeridas/IMG_3399.jpeg) | Empresas | Grafo indústrias | Card empresa (pai/filhos, conselho, executivos, contatos) | Lusha, Plia; busca |
| [`IMG_3400.jpeg`](telas_sugeridas/IMG_3400.jpeg) | *(Stack)* | — | Next PWA, Design System, PSQL+pgvector, GraphQL+REST, workers, LLM, Sentry, WAF, Swagger, extensão LinkedIn | Validação arquitetura |

---

## Tabela telas → entidades (objetivo)

| Tela | Entidades principais (ver [`modelagem.md`](modelagem.md)) | Jobs / API (ver arquitetura) |
|------|------------------------------------------------------------|------------------------------|
| Home | agregações de negócio, projeto, tarefa | GraphQL, materialized views |
| Contatos | contato, conta, conversa, tarefa | GraphQL, RBAC |
| Empresas | conta, relações de grafo | GraphQL |
| Negócios | negócio, conta, contato | SQL analytics |
| Conversas | conversa | GraphQL; Plia opcional |
| Projetos | projeto, candidato, documento | S3, Sidekiq |
| Conhecimento | documento, chunks | GenerateEmbeddingsJob |

---

*Versão 1.0 — maio de 2026.*
