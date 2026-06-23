# Plia 2 — Storytelling para apresentação aos sócios

---

## 1. O maior ativo da Plongê

- O maior ativo da Plongê é sua **base de contatos** e sua capacidade de criar **network**
- A Plongê não vende software, não vende horas: vende **relacionamento, confiança e inteligência de mercado**
- Tudo isso depende de uma coisa: **cuidar bem da rede**
- Paradoxo encontrado no diagnóstico:
  - "Rede de contatos" teve a **pior nota de satisfação** entre todas as dimensões avaliadas (média 4,8 de 10)
  - O ativo mais valioso da empresa é o que tem **menos estrutura** para ser cuidado
- O Plia tem que existir para ajudar a Plongê a **cuidar do que é mais importante no dia a dia** e a **potencializar essa rede**

---

## 2. O que aprendemos no diagnóstico (outubro 2025)

- Fizemos um trabalho sério: 8 entrevistas individuais, workshop coletivo, análise de formulários, análise consultiva em 8 verticais
- Achados relevantes para essa conversa:
  - ~R$ 500k investidos no Plia v1 com **retorno questionável**
  - **62%** das menções ao Plia nas entrevistas foram negativas
  - **83%** das pessoas refazem trabalho todo mês por falta de sincronização de informação
  - Dados dispersos entre Plia, Excel, WhatsApp, cabeça das pessoas — **sem fonte única da verdade**
  - O sistema depende da Bluecore, que a Plongê quer descontinuar
- E fizemos o postmortem — **juntos, presencialmente, com toda a empresa**

---

## 3. O postmortem: gratidão sem apego

- O Plia v1 foi **pioneiro**. Foi a primeira construção de software da Plongê. Isso tem valor
- O postmortem trouxe aprendizados que precisam guiar qualquer próximo passo:
  - *"Não entrar em nada só na emoção — decisões devem ser baseadas em dados e estratégia"*
  - *"Fundamental ter um dono técnico que entenda do projeto desde o início"*
  - *"Começar projetos sempre guiados por um especialista"*
  - *"Sempre combinar preço por entrega, não trabalhar em modelo taxímetro"*
  - *"Gestão de mudança é essencial e deve ser planejada"*
- Gratidão ao que foi construído. E vamos **preservar o que deu certo**:
  - O próprio postmortem reconhece: *"Customização das telas de acordo com nosso processo, resultando em um sistema com a cara da Plongê"* e *"Design do Plia com distribuição de projetos melhor que o Invenias"*
  - A interface do Plia v1 é bonita e tem a identidade da Plongê — vamos tirar prints de tudo e usar como referência de design para o Plia 2
  - Os **dados** serão migrados — nada se perde

---

## 4. Por que não dar manutenção no Plia v1?

- Essa é a pergunta natural. Já investimos ~R$ 500k. Por que não continuar?

### O sistema depende da Bluecore

- Qualquer alteração, correção ou evolução precisa passar pela fábrica
- A Plongê quer descontinuar essa relação
- No congelamento de 2025, já ficou uma lista de bugs mapeados e precificados que a Plongê decidiu não investir em corrigir
- Dar manutenção significa **voltar a depender de quem queremos nos desligar**

### O que encontramos na revisão técnica

Fizemos um walkthrough do código e do banco de dados em conjunto com a Bluecore. O resultado confirma que manter o v1 traz mais risco do que valor:

**Acessos ao Plia**

- Código — OK (back Node e front Vue em um monorepo)
- Banco — NOK (SQL Server, sem acesso direto)
- Infra — NOK (Azure, sem acesso direto)

A Plongê tem acesso ao código, mas **não tem acesso ao banco nem à infraestrutura**. Qualquer investigação ou correção depende da Bluecore.

**Dados**

- Tabela PIPELINES no banco do Plia — registros parecem OK, mas **Data Quality parece ruim**

**Pontos fortes do que existe**

- Empresa (conta) precisa estar cadastrada no Plia — isso é bom, garante integridade
- Campos do Pipeline parecem ter sido discutidos e refletem a realidade da Plongê

**Fragilidades encontradas**

- Etapas do funil são fixas, pouco ajustáveis, e carregam sobreposição de conceitos que deveriam estar separados (exemplo: "placed" é um status do pipeline e não de uma pessoa, "negócio" é um status e não o nome da entidade)
- Contagem de registros no Plia não está atualizada (há "506 negócios" no funil, o que não representa a realidade)
- Cada status do pipeline tem "sub-status", o que pode dificultar o acompanhamento
- "Atividades" não estão sendo usadas
- Usabilidade tem gaps que dificultam o uso
- Alterações nas listas suspensas envolvem código

Ou seja: o sistema tem méritos, mas as fragilidades são **estruturais** — não são bugs pontuais, são decisões de arquitetura que limitam a evolução.

### O custo de manter é maior que o de construir de novo

- O código é da Bluecore — ninguém na Plongê domina a base de código
- Para dar manutenção, seria necessário contratar alguém que primeiro **entenda** o sistema existente, depois corrija, depois evolua
- Com IA generativa, construir do zero com qualidade é **mais rápido** do que reverter engenharia de código de terceiro
- A interface é bonita, mas tem **problemas estruturais** de UX que foram citados no postmortem e nas entrevistas
- O banco de dados é bem modelado, mas reaproveitá-lo **não economiza tempo relevante**

### Manter o v1 contradiz os aprendizados do próprio postmortem

- O time disse: *"Fundamental ter um dono técnico que entenda do projeto desde o início"*
- Dar manutenção em código que ninguém domina é o oposto disso
- O time disse: *"Não subestimar o custo das mudanças"*
- Os custos de manutenção do v1 são imprevisíveis — cada bug pode revelar outros

### O que realmente importa no Plia v1 são os dados

- Contatos, empresas, negócios, conversas, projetos — tudo isso será **migrado**
- Os dados dos Google Forms também serão migrados
- **Nada se perde**. O que se ganha é uma base nova, limpa, proprietária, e sob controle técnico da Plongê

---

## 5. O que fizemos nesses 6 meses (novembro 2025 — abril 2026)

- Não ficamos parados. Enquanto o Plia v1 estava congelado, avançamos em três frentes:


| Período        | Pergunta central              | O que fizemos                                                          |
| -------------- | ----------------------------- | ---------------------------------------------------------------------- |
| **Set-Out/25** | O Plia é o problema?          | Diagnóstico, workshops, postmortem                                     |
| **Nov-Dez/25** | Onde focar a estratégia?      | Workshop estratégico, definição de OKRs, clareza de low hanging fruits |
| **Fev-Mar/26** | Estruturando entrada de dados | Form de conversas, analytics no Looker, planilha de contatos           |


### Frente 1: Estratégia e OKRs

- A Plongê definiu sua estratégia para 2026 com foco comercial, organizada em **4 pilares estratégicos**:

**Pilar principal — Crescimento e Perenidade**

- O: Sustentar expansão com rentabilidade garantindo o atingimento da meta
- KR1: 100% de cumprimento da nova rotina comercial de prospecção
- KR2: Pipeline 3x a meta do trimestre (previsibilidade)
- KR3: Vender 1 estudo por bimestre (R$ 100k em receita mensal)
- KR4: Visão de lucratividade da operação no 1o semestre

**Pilar — Eficiência e Inovação**

- O: Implementar uma cultura de dados na Plongê aumentando diferencial competitivo para conversão comercial
- KR1: Criar data lake para CRM consultivo = geração de leads até o 1o trimestre
- KR2: Desenvolver o Plia como CRM operacional (dados das ações comerciais e conceito de funil) dentro do 1o semestre

**Pilar — Inovação e Produto**

- O: Ampliar portfólio de produto visando geração de receita recorrente
- KR: Desenvolver MVP novo produto no 1o semestre e gerar faturamento recorrente até outubro

**Pilar — Posicionamento e Reputação de Marca**

- O: Reforçar o posicionamento como consultoria de referência em seleção de lideranças
- KR1: Plano de comunicação aprovado e em execução até 31/03
- KR2: 40 conteúdos LinkedIn/ano
- KR3: 6 conteúdos âncora/ano baseados em estudos e insights internos

O Plia 2 mora no pilar de **Eficiência e Inovação**, mas serve todos os pilares:

- **Crescimento**: dá visibilidade ao pipeline comercial e à rotina de prospecção
- **Inovação e Produto**: é a plataforma onde o novo produto pode ser construído (ver abaixo)
- **Posicionamento**: é a base de dados que alimenta os conteúdos e estudos de mercado

### Frente 2: Cultura de dados (Google Forms + Looker Studio)

- Criamos dois Google Forms estruturados:
  - **Conversas** — registro de cada interação relevante com contatos
  - **Contatos** — cadastro e atualização da base de pessoas
- A equipe **adotou**. Os forms estão sendo usados no dia a dia, com volume real de dados
- Plugamos o **Looker Studio** nos dados dos forms, criando um painel de analytics
- **O que isso validou**:
  - O modelo de dados funciona — Conversas e Contatos são o coração da operação
  - A equipe entende o valor de registrar — a resistência que existia com o Plia v1 não se repetiu
  - Os dashboards já geram valor: visibilidade que antes não existia
- **O que isso confirmou como dor**:
  - Google Forms é **operacionalmente pesado** — não tem interface de trabalho
  - O form registra, mas **não ajuda a equipe a trabalhar**
  - Falta fluidez: a pessoa registra a conversa, mas não vê o histórico do contato ali do lado
  - A equipe entende o valor dos dados, mas precisa de uma ferramenta que **facilite** em vez de **pesar**
- Isso corresponde ao **KR1 do pilar de Eficiência e Inovação** — o data lake para CRM consultivo. **Entregue.**

### Frente 3: Novo produto de priorização de pipeline

- Em paralelo, iniciamos o desenho de um produto de **priorização de pipeline de candidatos**, baseado na expertise da Plongê no setor de **Energia** (através da Luisa)
- A ideia: cruzar **Job Description** da vaga com **informações do currículo** dos candidatos e **anotações internas** da equipe, para gerar ranking e recomendações
- Fizemos discussões e trials com parceiros externos
- **Resultado: aquém do esperado**, e revelou um problema estrutural:
  - Usar ferramenta externa para o novo produto **enfraquece a proposta do Plia** como central de conhecimento da Plongê
  - Cria dependência externa para algo que deveria ser core
  - Os dados (JDs, CVs, anotações) precisam morar **dentro** do sistema da Plongê, não fora
- Conclusão: o novo produto precisa ser construído **dentro do Plia 2**

### Status atual do KR2: Plia como CRM operacional

O KR2 do pilar de Eficiência e Inovação é "desenvolver o Plia como CRM operacional (dados das ações comerciais e conceito de funil) dentro do 1o semestre". Onde estamos:


| Entrega                                                                                               | Status                  | Detalhe                                                                                                                     |
| ----------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Revisar registro de negócios dentro do Plia                                                           | Concluído com ressalvas | Walkthrough do código e banco de dados feito em conjunto com a Bluecore. Registros parecem OK, mas Data Quality parece ruim |
| V2 dos dashboards, incluindo funil de negócios e conversas                                            | Bloqueado               | Requer resolução integral do item acima. Data Quality ruim irá implicar em análises inconclusivas                           |
| Criar formulário para input de conversas dentro do Plia, coletando feedback de piloto no Google Forms | Em andamento            | Próxima discussão semanal: sobre Vibe Coding e futuro do Plia                                                               |


A revisão técnica do Plia v1 (detalhada na seção 4) reforça que o caminho não é corrigir o sistema existente, e sim construir o Plia 2.

### A conclusão desses 6 meses

- Temos o **processo validado** na prática (forms)
- Temos o **modelo de dados testado** com uso real e volume
- Temos **demanda orgânica** da equipe por algo melhor
- Temos **baseline de analytics** para comparar evolução
- Temos **OKRs que apontam diretamente** para a construção do Plia 2
- Temos a **confirmação de que construir fora não funciona** (experiência com o novo produto)

> **A decisão de construir o Plia 2 não é emocional. É informada por 6 meses de experimentação real.**
>
> Em 2022, a decisão de construir o ATS foi emocional, sem avaliar escopo ou custos totais.
> Em 2026, sabemos exatamente o que funciona porque **testamos na prática antes de investir**.

---

## 6. Plia 2: o próximo passo natural

- Não é começar do zero. É **dar forma e interface ao que já funciona**
- É o **KR2 do pilar de Eficiência e Inovação**: desenvolver o Plia como CRM operacional (dados das ações comerciais e conceito de funil)
- E é a **plataforma** onde o novo produto de priorização de pipeline pode ser construído com os dados certos

### Dados estruturados (já validados pelos forms)

- **Contato** (com Currículo)
- **Empresa**
- **Negócio** (com Job Description)
- **Projeto**
- **Participação em Projeto**
- **Atividade / Conversa**

### Dados não estruturados

- Anotações de entrevista
- Base de conhecimento

### O que muda vs. Google Forms

**Design que aproveita o Plia v1**

- A interface do Plia v1 é um dos acertos reconhecidos — vamos aproveitar ao máximo
- Prints do sistema atual servem de base para manter a identidade visual e a cara da Plongê
- O que muda é a **fundação por baixo** (código, arquitetura, independência), não necessariamente a cara do sistema

**Arquitetura de informação clara**

- Não é um form genérico — é uma interface feita para a Plongê
- Cada entidade (contato, empresa, negócio) tem sua tela, com os relacionamentos visíveis
- A pessoa registra uma conversa e vê o histórico do contato ali do lado

**Entrada conversacional via MCP**

- MCP (Model Context Protocol) é um protocolo que permite que uma IA interaja diretamente com o sistema — lendo e escrevendo dados
- Na prática: em vez de preencher um formulário campo por campo, a pessoa pode descrever a interação por texto ou voz, e o sistema entende, estrutura e armazena
- Exemplo: *"Conversei com João da Petrobras sobre a vaga de CFO. Ele está interessado mas quer mais detalhes sobre remuneração"* — o Plia entende quem é o contato, qual o negócio, e registra a conversa com os campos certos
- Isso resolve a dor principal dos Google Forms: o peso operacional de preencher campo por campo
- E vai além: transforma o Plia em um assistente de trabalho, não apenas um repositório

**Analytics integrado**

- Evolução do Looker Studio, integrado ao próprio sistema
- Meu progresso (visão individual)
- Progresso da Plongê (visão da empresa)

**Painel de admin**

- Configurações e listas padrão gerenciáveis pela própria equipe

**Migração**

- Dados dos Google Forms serão migrados
- Dados do Plia v1 serão migrados
- Nada se perde

---

## 7. Como vamos construir

### Princípios (aprendizados do postmortem aplicados)


| Aprendizado do postmortem            | Como se aplica no Plia 2                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| Decisão emocional, sem benchmark     | Decisão informada por 6 meses de forms + analytics                  |
| Sem dono técnico desde o início      | Rodolfo como dono técnico desde o dia 1, Luisa como dona de produto |
| Modelo taxímetro                     | Ciclos com entrega definida a cada 4 semanas                        |
| Gestão de mudança inexistente        | Equipe já usando o processo (forms) — transição natural             |
| Foco no sonho, negligência do básico | Primeiro o CRM operacional básico, depois evolução incremental      |
| Relação desgastada com fábrica       | Sistema proprietário, sem dependência de fábrica externa            |


### Abordagem

- Sistema **proprietário** — código e dados sob controle da Plongê
- Stack técnica a definir (decisão conjunta)
- Não precisa de "time de desenvolvimento" permanente — precisa de uma **célula de manutenção e sustentação**
- LGPD, compliance, backup, SRE: responsabilidades a endereçar pela célula de sustentação

### Ciclos de trabalho (4 semanas cada)


| Semana | Foco                     |
| ------ | ------------------------ |
| 1      | Construção               |
| 2      | Ajustes                  |
| 3      | Release e acompanhamento |
| 4      | Ajustes                  |


A cada ciclo: **entrega real, feedback da equipe, decisão de continuar ou ajustar rumo**. Nunca taxímetro.

### Cronograma inicial

- **Maio** — CRM operacional: Contato, Conversa, Empresa, Negócio (substituir os Google Forms)
- **Junho** — Plia Basics: acompanhamento de projetos
- **Meses seguintes** — a definir com base nos resultados dos primeiros ciclos

---

## 8. Riscos do projeto

### Riscos técnicos


| Risco                                         | Probabilidade | Impacto | Mitigação                                                                                        |
| --------------------------------------------- | ------------- | ------- | ------------------------------------------------------------------------------------------------ |
| Migração de dados com perda ou inconsistência | Média         | Alto    | Validação cruzada com os dados originais (forms + Plia v1); migração em etapas com conferência   |
| Escolha de stack inadequada                   | Baixa         | Alto    | Decisão informada, com critérios claros; priorizar ecossistema com boa documentação e comunidade |
| Subestimar complexidade de funcionalidades    | Média         | Médio   | Ciclos curtos de 4 semanas com entrega real; escopo mínimo primeiro                              |


### Riscos operacionais


| Risco                                                     | Probabilidade | Impacto | Mitigação                                                                               |
| --------------------------------------------------------- | ------------- | ------- | --------------------------------------------------------------------------------------- |
| Equipe não adotar o novo sistema (repetir Plia v1)        | Baixa         | Alto    | Equipe já usa o processo via forms; transição é de ferramenta, não de comportamento     |
| Expectativas desalinhadas sobre o que o sistema vai fazer | Média         | Alto    | Escopo claro por ciclo; apresentação a cada release; feedback estruturado               |
| Sobrecarga durante a transição (forms + sistema novo)     | Média         | Médio   | Migração por módulo — desligar o form só quando o módulo correspondente estiver estável |


### Riscos organizacionais


| Risco                                                   | Probabilidade | Impacto | Mitigação                                                                       |
| ------------------------------------------------------- | ------------- | ------- | ------------------------------------------------------------------------------- |
| Falta de célula de sustentação após a construção        | Alta          | Alto    | Definir **antes de começar** — ver seção 9                                      |
| Perda do dono técnico sem transferência de conhecimento | Média         | Alto    | Documentação, código limpo, stack acessível; planejar transição                 |
| Prioridades concorrendo com outras demandas da empresa  | Média         | Médio   | Sponsor claro (Luisa + Rodolfo); ciclos com entrega que demonstram valor rápido |


### Risco financeiro


| Risco                                                    | Probabilidade | Impacto | Mitigação                                                                                           |
| -------------------------------------------------------- | ------------- | ------- | --------------------------------------------------------------------------------------------------- |
| Investimento crescer além do planejado (repetir Plia v1) | Média         | Alto    | Ciclos de 4 semanas com escopo fechado; decisão de continuar ou parar a cada ciclo; nunca taxímetro |


---

## 9. O que a Plongê precisa decidir

### Donos do projeto

- **Luisa** — dona de produto (principal), co-DRI nos OKRs de Eficiência e Inovação
- **Rodolfo** — dono técnico, construtor, co-DRI nos OKRs de Eficiência e Inovação

### O novo produto mora dentro do Plia 2

- **Proposta**: o produto de priorização de pipeline de candidatos (setor de Energia) deve ser construído **dentro** do Plia 2, não com ferramentas externas
- Motivo: os dados necessários (JDs, CVs, anotações) já estarão no sistema; construir fora enfraquece a central de conhecimento e cria dependência externa
- Isso alinha o pilar de **Inovação e Produto** com o pilar de **Eficiência e Inovação** — o Plia 2 serve os dois

### Célula de sustentação e infra

Quem cuida de backup, SRE, LGPD, monitoramento e manutenção após a construção? Três opções:


| Opção                            | Descrição                                                            | Prós                                                                                 | Contras                                                                    |
| -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Tech Jungle (Rodolfo)**        | Rodolfo absorve a sustentação via Tech Jungle, a um valor a discutir | Continuidade técnica; quem construiu é quem mantém; conhecimento profundo do sistema | Dependência de uma pessoa; precisa de acordo comercial claro               |
| **Dev contratado pela Plongê**   | Contratar um desenvolvedor "1001 utilidades" para o time             | Recurso interno; autonomia total; pode atender outras demandas de tech               | Custo fixo (CLT/PJ); precisa encontrar perfil certo; risco de rotatividade |
| **Fábrica parceira (ex: Liven)** | Terceirizar sustentação para uma fábrica de software                 | Escala; SLA formal; menos gestão de pessoas                                          | Custo; risco de repetir dinâmica Bluecore; menos contexto sobre o negócio  |


**Recomendação**: Tech Jungle (Rodolfo), a um valor a discutir — garante continuidade e contexto técnico

### Decisões em aberto

- **Stack técnica** — a definir em conjunto (critérios: ecossistema, documentação, comunidade, facilidade de manutenção)
- **Prioridades além de junho** — a definir com base nos resultados dos primeiros ciclos
- **Investimento** — ver seção 10

---

## Síntese: por que dessa vez é diferente


| Plia v1 (2022)                                  | Plia 2 (2026)                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| Decisão emocional, sem escopo ou custo definido | Decisão informada por 6 meses de experimentação real                |
| Sem dono técnico                                | Rodolfo como dono técnico desde o dia 1, Luisa como dona de produto |
| Fábrica externa (Bluecore), modelo taxímetro    | Sistema proprietário, ciclos com entrega fechada                    |
| Equipe resistiu à adoção                        | Equipe já usa o processo (forms) — demanda orgânica                 |
| Gestão de mudança inexistente                   | Transição natural: mesmos dados, interface melhor                   |
| Dados dispersos, sem validação prévia           | Modelo de dados testado na prática por 6 meses                      |
| Primeiro investimento em software da empresa    | Empresa com aprendizado, postmortem feito, maturidade               |
| Produto novo tentado com ferramenta externa     | Produto construído dentro da plataforma, com os dados certos        |
| Sem estratégia clara, sem OKRs                  | OKRs definidos, 4 pilares estratégicos, KR1 já entregue             |


