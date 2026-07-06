# Processo Plongê — Versão Revisada (Redesenho assistido por IA)

**Documento de uso interno — confidencial (Plongê Executive Search).**

**Base:** consolida e parte de `o_processo_v_claude.md`, cruzando com `o_processo.md` (mapeamento original de 17/06/2026) e `o_processo_v_cursor.md`. Incorpora todos os insights e dores registrados nos anexos daquelas versões.

**Autoria desta versão:** redesenho proposto por IA, a partir do mapeamento do time. **Não é decisão tomada** — é insumo para os sócios e o time decidirem. Toda recomendação aqui é candidata a teste, não verdade imposta.

**Lente de redesenho (objetivos que guiaram cada escolha):** maior clareza de dados; menor carga operacional; uso mais efetivo de tecnologia; IA usada de forma ética; controle de custos; aumento de eficiência operacional; e cuidado com o cliente (e com o candidato).

---

## Como ler este documento

O documento tem três blocos:

1. **Diagnóstico e princípios** — por que mudar e com que critério.
2. **Modelo operacional + fluxo em fases** — como o trabalho passa a ser organizado e a jornada do projeto, fase a fase.
3. **Camadas transversais + roadmap** — dado, tecnologia/IA, LGPD, KPIs e cuidado com cliente/candidato, que cortam todas as fases; e por onde começar.

Ao longo do texto:

- 🔧 **Mudança estrutural** — altera como o time se organiza (não só uma tarefa).
- 💡 **Melhoria pontual** — ganho localizado, baixo atrito para adotar.
- ⚖️ **Ponto de dado/ética/LGPD** — exige cuidado de governança.
- ❓ **A confirmar** — premissa que precisa de validação humana antes de virar regra.

> **Convenção mantida do mapeamento:** cada macro etapa é conduzida pelo **Dono do Projeto**, designado no Kickoff. As fases são **sequenciais e irreversíveis** ("não se volta de fase") e representam **marcos billáveis** ao cliente em caso de cancelamento.

---

## Diagnóstico em uma página

O time mapeou o processo com honestidade rara. Os sintomas se repetem nas três versões e nos anexos, e quase todos apontam para as mesmas causas-raiz:

**1. O gargalo está no início do funil.** A hipótese do próprio time é provavelmente correta: a sobrecarga se concentra nas etapas iniciais do processo seletivo (estratégia, mapeamento, busca, abordagem). Esse é o **caminho crítico**, e o número de projetos que a Plongê consegue ter *simultaneamente nessa fase* é, na prática, o **throughput da empresa**. Tudo que tira capacidade dali derruba a vazão da casa inteira.

**2. Tarefas não fecham.** Muitas atividades são contínuas ("abre e fica aberta até o fim do projeto"). Sem condição de término, não há como medir progresso, priorizar nem confiar num painel. O time vive a sensação de "muitos pratos girando".

**3. Dado entra em duplicidade e sai pouco.** A mesma conversa é registrada em OneNote, Google Forms e planilha de contatos, em paralelo ao PLIA e ao SharePoint. Há esforço de digitação repetida e, ainda assim, baixa clareza de dado consolidado. A "Conversa" — que é o **principal ativo de conhecimento** da Plongê — é capturada de forma fragmentada.

**4. Trabalho de baixo valor consome quem é escasso.** Agendamentos recorrentes sobrecarregam a Pesquisa gerando pouco valor; tarefas operacionais fora do caminho crítico roubam a capacidade que faria diferença no gargalo.

**5. Tecnologia e IA aparecem como insights soltos.** NPS automático de candidato, apoio de IA na checagem de referências, formulário de preparo de fechamento, Call de Quality apoiada por dado — tudo já foi intuído pelo time, mas sem uma camada que diga *onde* aplicar, *com que controle* e *a que custo*.

**6. Riscos de dado/segurança convivem com o operacional.** Merge de PDFs de candidatos em ferramenta gratuita online é o exemplo gritante: dado pessoal de executivo subindo para serviço não contratado. Há também risco de misturar dados entre processos.

**7. O fim do projeto cansa o cliente — e deixa dinheiro na mesa.** "Mais uma reunião com a Plongê" é a sensação relatada. Ao mesmo tempo, a Call de Quality — reconhecida como estratégica para recompra — é pouco feita.

O redesenho a seguir ataca essas sete causas, não os sintomas isolados.

---

## Princípios de redesenho

Oito princípios orientaram cada decisão. Quando duas opções competiam, venceu a que melhor servia a estes princípios — e, em conflito entre executar e proteger dado, protegeu-se o dado.

1. **Proteja o caminho crítico.** Capacidade escassa (busca/abordagem no início do funil) é tratada como recurso de gargalo: tudo se dimensiona para maximizar sua vazão.
2. **Toda tarefa tem fim.** Cada atividade ganha uma **Definição de Pronto (DoD)** verificável. Atividade "contínua" vira ou um ritual com cadência fixa, ou uma tarefa que fecha.
3. **Capture uma vez, use muitas.** Um dado é inserido em **uma** superfície e flui para as demais. Fim da redigitação.
4. **IA é copiloto, não piloto.** A IA acelera o trabalho braçal e estrutura informação; a decisão e o julgamento sobre pessoas são sempre humanos (art. 20 LGPD — não há decisão automatizada sobre candidatos).
5. **Menos ferramentas, melhor usadas.** Consolidar a stack reduz custo, duplicidade e superfície de risco. Ferramenta grátis que custa dado não é economia.
6. **Fase = marco billável.** As fases espelham os terços clássicos de retained search (engajamento, shortlist, conclusão), de modo que cada fase concluída seja defensável e cobrável.
7. **Cuidar do candidato é estratégia, não cortesia.** Em executive search, o candidato reprovado de hoje é o cliente, a referência ou o finalista de amanhã. Experiência do candidato é ativo de marca e de rede.
8. **Cuidar do cliente é gerar recompra.** O fim do projeto é início do próximo. Menos reuniões e mais valor; a qualidade vira ritual deliberado, não algo "que sobra".

---

## Modelo operacional: capacidade, gargalo e throughput

🔧 **Esta é a mudança mais estrutural do redesenho.** Antes de falar de fases, é preciso mudar *como o trabalho é organizado entre as pessoas*. Sem isso, qualquer reorganização de etapas só reposiciona a mesma sobrecarga.

### O gargalo é o front-end, então ele manda no ritmo

Aplicando a lógica de Teoria das Restrições ao processo: se o início do funil é o gargalo, **a vazão da empresa é definida ali** — não adianta acelerar o que vem depois. Três consequências práticas:

- **Limite de trabalho em andamento (WIP) no caminho crítico.** Define-se um teto explícito de quantos projetos podem estar *simultaneamente* nas Fases 2–3 (estratégia/mapa/busca/abordagem). Estourou o teto → o próximo projeto entra em fila declarada, não "empurrado" para um time já saturado. Isso troca sobrecarga invisível por fila visível e gerenciável.
- **A unidade de planejamento é a semana** (como o time já opera). Cada pessoa tem uma capacidade semanal em "fatias de projeto"; o gargalo é planejado primeiro, e o resto se acomoda em volta.
- **Right-sizing do que não é gargalo.** O corolário do próprio time vale: cortar ~1 dia/semana de trabalho operacional de cada Associado/Pesquisa (via automação e pooling, abaixo) pode liberar capacidade para **+1 projeto simultâneo** por pessoa no gargalo. O ganho de throughput vem de desafogar o caminho crítico, não de "correr mais".

### 🔧 Núcleo de Busca compartilhado (a aposta ousada)

Hoje a busca está acoplada ao time de cada projeto. Proposta: criar um **Núcleo de Busca** — uma capacidade de sourcing/mapeamento **compartilhada entre projetos**, que atende a fila do gargalo de forma pooled, em vez de cada projeto carregar sua busca isolada.

Por que isso é defensável:

- O próprio time levantou a dúvida certa: *"quais partes do processo precisam ser o mesmo time de execução e quais podem ser qualquer um da Plongê?"*. Busca em fontes, identificação, rodada de LinkedIn e montagem de grid são, em boa parte, **fungíveis** — não exigem o sócio que vendeu a conta. Já entrevista, advisory ao cliente e negociação **exigem** continuidade de relação.
- Poolar o gargalo permite **usar o tempo ocioso de uns para desafogar os sobrecarregados** — exatamente o que o time desejou — e dimensionar a busca de forma independente do número de contas.
- O conhecimento tácito que se perderia é recuperado pela camada de dado (a Conversa estruturada, adiante): o Núcleo entrega mapa e grid documentados, não "na cabeça de alguém".

❓ **A confirmar:** o grau de separação (núcleo dedicado vs. "chapéu" rotativo entre Pesquisa/Associados) e como reconhecer o trabalho pooled. Recomenda-se um **piloto com 2–3 projetos** antes de institucionalizar.

> **Resguardo de qualidade:** mesmo com busca poolizada, mantém-se o princípio levantado pelo time de que **uma mesma pessoa conduza toda a checagem de referências** de um finalista (visão global do perfil). Pooling é para o volume de sourcing, não para o julgamento de finalista.

### Agendamento sai das costas da Pesquisa

💡 A hipótese do time ("muitos momentos de agendamento sobrecarregam a Pesquisa gerando pouco valor") vira regra de desenho: **agendamento é trabalho de baixo valor e alto volume — candidato número 1 a sair do caminho crítico.** Caminhos:

- Auto-agendamento (links de disponibilidade) para entrevistas Plongê e do cliente, eliminando o vai-e-volta manual.
- Onde houver intervenção humana, ela é de uma **função de coordenação** (pode ser pooled/junior dedicado), não da Pesquisa sênior que deveria estar buscando.
- ⚖️ Atenção LGPD: links de agendamento coletam o mínimo (nome, e-mail, horário) e não devem pedir dado sensível nem ser usados para inferir nada além da logística.

### Papéis, com foco em não virar "tarefeiro"

O time alertou para o risco de, com um sistema de tarefas, todos virarem "tarefeiros". O desenho assume isso explicitamente:

| Persona | Foco primário | No novo modelo |
|---|---|---|
| **Sócio** | Relação com cliente, julgamento de perfil, advisory, recompra | ~60% em registro/inteligência e governança de pauta (gerar dado e direção); o resto em execução de alto valor. Não é fila de tarefas operacionais. |
| **Associado** | Condução do projeto, entrevista gerencial, relatórios, negociação | Dono do Projeto típico; orquestra, não executa tudo. |
| **Pesquisa** | Inteligência de busca e dado | Realocada para o que é gargalo de verdade (mapa, busca, identificação); liberada de agendamento e de digitação duplicada. |
| **Tecnologia** | Automação, IA, dado, segurança | Passa de "apoio" a **dono da camada transversal** (dado/IA/LGPD/painel). Garante que o processo rode bem. |
| **Coordenação** (a formalizar) ❓ | Agendamento, salas, follow-ups operacionais | Absorve o operacional de baixo valor hoje espalhado, protegendo o caminho crítico. |

---

## O fluxo em fases

As fases foram reorganizadas para coincidir com os **três marcos billáveis** clássicos de retained search — o que o próprio time pediu ("fases devem representar marcos billáveis ao cliente"):

| Fase | Nome | Marco billável |
|---|---|---|
| 0 | Originação Comercial | — (pipeline, pré-contrato) |
| 1 | Engajamento & Mobilização | **1º terço** (na assinatura/kickoff) |
| 2 | Estratégia, Mapa de Mercado & Calibragem | — |
| 3 | Busca, Abordagem & Avaliação Plongê | — |
| 4 | Shortlist | **2º terço** (na entrega da shortlist) |
| 5 | Entrevistas com Cliente, Referências & Seleção | — |
| 6 | Proposta, Aceite & Placement | **3º terço** (no aceite) |
| 7 | Embarque, MEP, Garantia & Recompra | — (serviço de garantia / gatilho de recompra) |

❓ **A confirmar:** se o modelo comercial da Plongê de fato fatura em terços nesses marcos. Se a régua de cobrança for outra, mantém-se a lógica de "fase irreversível = entregável defensável", reposicionando os marcos.

Cada fase abaixo traz: **marcos**, **atividades** (com responsável, quem executa e **Definição de Pronto**), e quatro recortes rápidos — **🤖 Tecnologia & IA**, **⚖️ Dado & risco**, **📊 KPI da fase** e **⚙️ Gatilhos de automação**.

---

### Fase 0 — Originação Comercial

**Entrada:** oportunidade comercial identificada. **Saída:** aceite da proposta pelo cliente.
**Conduzida por:** Sócio (o Dono do Projeto só é designado na Fase 1).

| Atividade | Responsável / Executa | Definição de Pronto (fecha quando…) |
|---|---|---|
| Registro da oportunidade no PLIA | Sócio | Oportunidade existe no PLIA com estágio, cliente e perfil-alvo preliminar — **mesmo antes de virar GANHA**. |
| Qualificação e proposta | Sócio | Proposta enviada e estágio atualizado no PLIA. |

- 🤖 **Tecnologia & IA:** IA redige rascunho de proposta a partir do briefing e de projetos análogos passados; sócio revisa. Resumo automático do histórico do cliente no CRM antes da reunião.
- ⚖️ **Dado & risco:** registrar só o necessário à oportunidade. Em vaga sigilosa, **o cliente contratante não é exposto** fora do círculo autorizado. Não reaproveitar dado de candidatos de outros processos para "encher" esta oportunidade.
- 📊 **KPI da fase:** taxa de conversão proposta→ganha; tempo de resposta ao lead.
- ⚙️ **Gatilhos:** ao registrar oportunidade → tarefa de follow-up comercial para o Sócio. Ao marcar GANHA → criar tarefa "Agendar Kickoff" e abrir o projeto.

---

### Fase 1 — Engajamento & Mobilização (Kickoff) · 💰 1º terço

**Entrada:** aceite da proposta. **Saída:** projeto mobilizado — Dono do Projeto designado, cronograma com datas enviado, pasta criada, weeklys agendadas, ponto de contato definido, **perfil-alvo calibrado** e agendas de entendimento com data fechada.
**Conduzida por:** Dono do Projeto (designado aqui).

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Kickoff interno | Sócio · todo o time | Dono do Projeto designado; responsabilidades divididas; **datas das agendas de entendimento já fixadas** (mata o risco de "agendas infindáveis"). |
| Abertura do espaço do projeto (pasta + CRM) | Coordenação/Pesquisa | Pasta única criada e vinculada ao projeto no painel; uma só "fonte da verdade" por projeto. |
| Agenda de weeklys | Dono do Projeto | Recorrência criada com início e **condição de encerramento definida** (ver Fase 7 — resolve a dúvida "quando param as weeklys"). |
| Conversas de Entendimento com o cliente | Sócio | Cronograma com datas enviado ao cliente; perfil-alvo (competências, experiência, senioridade, idiomas, contexto) documentado de forma estruturada. |

- 🤖 **Tecnologia & IA:** a partir do briefing, IA gera rascunho de **descritivo de posição e do perfil-alvo** (critérios estritamente profissionais), além do checklist de kickoff pré-preenchido. Sócio valida.
- ⚖️ **Dado & risco:** o perfil-alvo deve conter **apenas critérios profissionais** — competências, experiência, resultados, formação, idiomas. Sem gênero, idade, estado civil, filhos, aparência ou qualquer proxy de viés ("perfil jovem", "fit cultural" sem critério objetivo). Se o cliente pedir filtro discriminatório, não se executa: registra-se o critério legítimo equivalente (senioridade, anos de experiência) e sinaliza-se ao sócio.
- 📊 **KPI da fase:** kickoff realizado em ≤ X dias do aceite; % de projetos com perfil-alvo estruturado no dia 1.
- ⚙️ **Gatilhos:** ao marcar GANHA → tarefa "Realizar Kickoff" com checklist anexo. Ao concluir o Kickoff → registrar Dono do Projeto, criar pasta, agendar weeklys e abrir as agendas de entendimento com datas. **Disparar a cobrança do 1º terço.**

> **🔧 Mudança vs. processo atual:** a *calibragem do perfil-alvo* foi puxada para o Kickoff (não fica difusa no início da busca). É aqui que se previne retrabalho lá na frente.

---

### Fase 2 — Estratégia, Mapa de Mercado & Calibragem

**Entrada:** projeto mobilizado e perfil-alvo calibrado. **Saída:** **grid de abordagem e entrevistas validado** — tudo dentro da **semana 1**.
**Conduzida por:** Dono do Projeto · **Executa:** Núcleo de Busca.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Definição da estratégia de busca | Associados (def.) · Pesquisa (exec.) | Estratégia documentada, revisitando projetos análogos. Fecha com a estratégia escrita no espaço do projeto. |
| **Mapa de mercado / long list + validação do perfil-alvo** *(resolve o "falta uma etapa aqui" do mapeamento original)* | Pesquisa (exec.) · Associados (valida) | Mapa de empresas/cargos-alvo montado e **calibrado com o cliente/sócio**: confirma que a estratégia está mirando o lugar certo antes de abordar. Fecha com mapa validado. |
| Conferir off-limits | Dono do Projeto (recom.) · Pesquisa (exec.) | Off-limits checados contra contratos/relacionamentos vigentes; lista de empresas vetadas registrada. **Tarefa fecha com o registro do veto** (não fica "em aberto"). |
| Busca, identificação e rodada de LinkedIn | Pesquisa / Núcleo de Busca | Candidatos identificados nas fontes definidas e carregados no pipeline do projeto. |
| Definição do grid de abordagem e entrevistas | Pesquisa (exec.) · Associados (valida) | Grid validado pelos Associados. **Marco de saída da semana 1.** |

- 🤖 **Tecnologia & IA:** IA acelera o mapa de mercado (organização de empresas/cargos a partir de fontes públicas profissionais), sugere termos de busca booleana de LinkedIn e estrutura a long list. **Toda informação é profissional e pública** — sem OSINT de vida pessoal, redes privadas ou conteúdo atrás de login. O julgamento de quem entra no grid é humano.
- ⚖️ **Dado & risco:** off-limits é controle **ético e contratual** — nunca abordar quem o contrato veda. Minimização: a long list guarda só o profissional necessário à decisão. Sem cruzar dados para reidentificar pessoas ou ligar perfis profissionais a contas pessoais.
- 📊 **KPI da fase:** % de projetos com grid validado dentro da semana 1; tamanho/qualidade do mapa; nº de candidatos identificados por dia de pesquisa.
- ⚙️ **Gatilhos:** ao concluir entendimento → tarefa "Definir estratégia". Ao validar estratégia → tarefa "Conferir off-limits". Ao confirmar off-limits → **liberar** as tarefas de busca para o Núcleo. Ao validar o grid → notificar Dono do Projeto para Fase 3 e **alertar se a semana 1 estiver para estourar** (proteção do caminho crítico).

> **🔧 Mudança vs. processo atual:** o "gap da etapa 7" do mapeamento foi nomeado — é a **construção e calibragem do mapa de mercado/long list**. E o off-limits virou tarefa com fechamento, não pendência perpétua.

---

### Fase 3 — Busca, Abordagem & Avaliação Plongê

**Entrada:** grid validado. **Saída:** Entendimento apresentado/enviado ao cliente — até a **semana 3**.
**Conduzida por:** Dono do Projeto · **Executa:** Núcleo de Busca + Associados/Sócios nas entrevistas.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Início das abordagens | Pesquisa/Núcleo (exec.) · Sócios (expertise técnico) | Abordagens disparadas conforme o grid; status por candidato no pipeline. ⟳ Em paralelo: antecipação de referências (C-Level). |
| Antecipar referências (só C-Level) | Sócio | Referências preliminares registradas. ⟳ Paralelo às abordagens. |
| Pedir indicações ao mercado | Associado · Sócio (suporte) | Indicações coletadas e adicionadas ao pipeline. |
| Agendamento de entrevista + pedido de CV | **Auto-agendamento** · Coordenação (exceções) | Entrevista marcada e CV recebido. **Sai do colo da Pesquisa.** |
| Entrevista Plongê | Sócio (geral) · Associado (gerencial) | Entrevista realizada **e Conversa registrada** (ver camada de dado). A tarefa só fecha com o registro feito. |
| Apresentação / Envio do Entendimento | Sócio (resp.) · Associados (exec.) | Entendimento enviado ao cliente. **Marco da semana 3.** |

- 🤖 **Tecnologia & IA:** rascunho de mensagens de abordagem personalizadas (posicionamento de boutique de executive search, não cold sales genérico); **transcrição e estruturação automática das entrevistas** em ficha padronizada (com validação humana) — é o maior alívio operacional da fase. Auto-agendamento elimina o vai-e-volta.
- ⚖️ **Dado & risco:** mensagens não inferem nem citam dado sensível (raça, religião, saúde, opinião política etc.), nem por pistas indiretas. Se o candidato mencionar algo sensível, registra-se de forma neutra ("afastamento pessoal"). Gaps de carreira tratados de forma neutra. CV e fichas ficam **no espaço daquele processo** — não migram entre projetos.
- 📊 **KPI da fase:** taxa de resposta às abordagens; nº de abordagens→entrevistas; % de entrevistas com Conversa registrada; aderência ao marco da semana 3.
- ⚙️ **Gatilhos:** ao validar grid → tarefa "Iniciar abordagens" + (se C-Level) "Antecipar referências". Ao candidato aceitar conversar → link de auto-agendamento + lembrete de CV. Ao concluir entrevista → tarefa "Registrar Conversa" para os participantes. Ao chegar à semana 3 → alerta se o Entendimento ainda não saiu.

---

### Fase 4 — Shortlist · 💰 2º terço

**Entrada:** Entendimento enviado. **Saída:** shortlist apresentada ao cliente — idealmente em **20 dias úteis** do início do projeto (tipicamente **semana 4**).
**Conduzida por:** Dono do Projeto.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Apresentação da Shortlist | Sócio (resp.) · Associado (exec.) | Shortlist apresentada/enviada ao cliente. **Grande marco do projeto.** |
| Sign-off humanizado dos não-selecionados | Pesquisa (abordagem) · Associados (entrevista) | Cada candidato fora da shortlist recebe devolutiva humana; status encerrado no pipeline (ver camada Cuidado com o Candidato). |

- 🤖 **Tecnologia & IA:** IA monta o **rascunho da shortlist** (comparativo de finalistas por critério profissional, a partir das Conversas estruturadas) — sócio/associado editam e assinam. **NPS automático** dispara após o sign-off humano, como rede de proteção (nunca substitui a devolutiva pessoal).
- ⚖️ **Dado & risco:** o comparativo de candidatos usa **só critério profissional**; a IA não rankeia nem "aprova/reprova" — apenas organiza evidências para decisão humana (art. 20). O documento é confidencial e marcado como tal.
- 📊 **KPI da fase:** **time-to-shortlist** (dias úteis desde o início) — o KPI-mestre do throughput; nº de candidatos na shortlist; NPS de candidato.
- ⚙️ **Gatilhos:** ao iniciar a fase → tarefa "Montar shortlist" com prazo de 20 dias úteis. Ao enviar → **disparar cobrança do 2º terço**, criar tarefas de sign-off dos não-selecionados e **manter as weeklys ativas** (o projeto não acabou).

> **🔧 Mudança vs. processo atual:** o sign-off vira um **ritual padrão e recorrente** (humano + NPS), descrito uma única vez na camada de cuidado com o candidato e acionado sempre que alguém sai — em vez de reaparecer solto em várias etapas.

---

### Fase 5 — Entrevistas com Cliente, Referências & Seleção

**Entrada:** shortlist enviada. **Saída:** finalista(s) escolhido(s), **referências concluídas** e follow-ups feitos.
**Conduzida por:** Dono do Projeto.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| NDA ao candidato (se requisito do cliente) | Pesquisa | NDA enviado e assinatura registrada. |
| Abrir nome do cliente ao candidato | Associados | Feito **somente** após autorização (e NDA, quando aplicável). |
| Materiais/Relatórios dos candidatos | Associado (exec.) · Sócio/Associados (valida) | Relatório pronto **até 2 dias após a shortlist**, sob demanda do agendamento. |
| Agendamento da entrevista do cliente | **Auto-agendamento** · Coordenação | Entrevista marcada. |
| Envio do relatório ao cliente | Pesquisa | Relatório entregue ao cliente por canal seguro. |
| Abertura de salas com candidato | Coordenação/Pesquisa · Associados/Sócios (primeiros minutos) | Sala aberta; "temperatura medida" nos minutos iniciais. |
| Entrevista do cliente | Cliente · Dono do Projeto (apoio) | Entrevista realizada. |
| FUP com cliente e com candidato | Associados · Sócio (advisor) | Os dois follow-ups feitos e registrados. |
| **Checagem de Referências** | **Uma pessoa conduz** (perfil define quem) · Associado delimita · Sócio valida | Referências concluídas e relatório pronto. Concentrar numa só pessoa = visão global do finalista. |

- 🤖 **Tecnologia & IA:** ⚖️ **corrigir já o risco apontado** — o merge/empacotamento do relatório do candidato **não** deve usar ferramenta gratuita online (dado pessoal de executivo em serviço não contratado). Usar ferramenta local/licenciada e canal seguro de envio. IA ajuda a **redigir o relatório de referências** a partir das notas (a "skill" que o time intuiu) — sempre com revisão humana e **sem inferir dado sensível**.
- ⚖️ **Dado & risco:** abrir o nome do cliente só com autorização (sigilo do contratante). Relatórios são confidenciais, evitam CPF/RG/endereço completo além do necessário. Referências colhem só percepção profissional; nada de vida pessoal.
- 📊 **KPI da fase:** taxa shortlist→entrevista do cliente; nº de finalistas; tempo shortlist→finalista; % de relatórios entregues no SLA de 2 dias.
- ⚙️ **Gatilhos:** ao enviar shortlist → cascata por candidato avançado (NDA → abrir nome → relatório → agendamento → envio → sala → entrevista). Ao concluir entrevistas → tarefas de FUP. Ao surgir finalista → tarefa "Checagem de Referências" concentrada numa pessoa.

---

### Fase 6 — Proposta, Aceite & Placement · 💰 3º terço

**Entrada:** finalista(s) escolhido(s) e referências concluídas. **Saída:** **aceite do candidato** — toca a Plonguita! 🐔
**Conduzida por:** Dono do Projeto.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Desenho da proposta e negociação | Associado/Dono do Projeto · Sócio ("medir temperatura") | Proposta desenhada e negociada com o candidato. |
| O grande momento — o aceite! | Dono do Projeto | Candidato aceita formalmente. **Marco de saída.** Toca-se a Plonguita (galinha de plástico das comemorações). Vitória! |

- 🤖 **Tecnologia & IA:** IA modela cenários de proposta (faixas, comparativos de mercado a partir de dado público/profissional) como insumo — a negociação e o "medir temperatura" são humanos.
- ⚖️ **Dado & risco:** dados de remuneração não são inventados; distinguir sempre **fato verificado, autodeclarado e estimativa**, com fonte e data. Proposta e contrapartes são confidenciais.
- 📊 **KPI da fase:** taxa de aceite (offer→accept); tempo finalista→aceite; **time-to-fill** total.
- ⚙️ **Gatilhos:** ao concluir referências → tarefa "Desenhar proposta e negociar". Ao registrar aceite → **disparar cobrança do 3º terço**, celebrar no painel e abrir a Fase 7.

---

### Fase 7 — Embarque, MEP, Garantia & Recompra

**Entrada:** aceite do candidato. **Saída:** sessões de embarque concluídas, devolutivas do MEP feitas, **Call de Quality realizada** e período de garantia em monitoramento.
**Conduzida por:** Dono do Projeto.

> ❓ **A confirmar (sem inventar):** **MEP** e **Inove** não estão definidos no material. O desenho assume que o **MEP** é um instrumento de assessment/desenvolvimento aplicado no embarque, com devolutiva ao candidato e ao cliente, e que a **Inove** é o parceiro externo que o fornece. **Validar essas definições** antes de publicar a versão final.

| Atividade | Responsável / Executa | Definição de Pronto |
|---|---|---|
| Solicitação e envio do MEP | Pesquisa (solicita à Inove) | MEP solicitado e recebido. |
| Agenda de fechamento interno do projeto | Coordenação/Pesquisa (puxa) | Reunião feita **com formulário de preparo** (insight do time) cobrindo o que é caro à Plongê no encerramento. **Aqui encerra a recorrência das weeklys** (resolve a dúvida do mapeamento). |
| Devolutiva do MEP ao candidato | Sócios/Associados habilitados (hoje: Adriana, Stefani; Duda) | Devolutiva realizada. |
| Devolutiva do MEP ao cliente | Associados | Devolutiva realizada. |
| Sessões de Embarque | Sócio (Associados p/ gerencial) · Coordenação (agenda) | Sessões concluídas. |
| Relatórios MEP (candidato e cliente) | Pesquisa | Relatórios enviados. |
| **Call de Quality** | **Sócio fora da entrega** (recom.) | Call feita; sinais de satisfação e **oportunidade de recompra** registrados no CRM. |

- 🤖 **Tecnologia & IA:** IA gera o **formulário de preparo de fechamento** e um **resumo de saúde do projeto** (prazos cumpridos, NPS, marcos) para municiar a Call de Quality com dado — exatamente o "Call de Quality apoiada por tecnologia" que o time imaginou.
- ⚖️ **Dado & risco:** devolutivas de assessment tocam temas sensíveis — descrever de forma neutra e estritamente profissional; nada de inferência sobre saúde, personalidade clínica etc. **Retenção:** ao encerrar, aplicar política de retenção/eliminação do dado do processo (ver LGPD) e respeitar pedidos de "esquecer o candidato".
- 📊 **KPI da fase:** % de projetos com Call de Quality realizada (hoje baixo — meta de elevar); retenção do colocado no período de garantia; **taxa de recompra**; NPS do cliente.
- ⚙️ **Gatilhos:** ao registrar aceite → "Solicitar MEP à Inove" + "Agendar fechamento interno". Ao concluir fechamento → encerrar weeklys e abrir embarque. Ao concluir devolutivas → consolidar FUPs do cliente (menos reuniões, ver Cuidado com o Cliente). Ao fim → tarefa "Call de Quality" (sócio fora da conta) e avaliação de gatilho de recompra.

> **🔧 Mudanças vs. processo atual:** (a) **weeklys têm fim declarado** no fechamento interno; (b) a **Call de Quality** vira tarefa obrigatória conduzida por um **sócio fora da entrega** (olhar fresco + foco em recompra), resolvendo a pendência "quem faz?"; (c) **capacitação no MEP** vira item de roadmap (hoje só Adriana, Stefani e Duda; faltam Rodolfo, Victoria Monjardim, Luisa) — gargalo de pessoas a eliminar.

---

# Camadas transversais

Cinco camadas cortam todas as fases. São onde moram os objetivos de clareza de dados, tecnologia, IA ética, custo e cuidado.

## A. A Conversa como ativo de dado — "capture uma vez, use muitas"

A Plongê já sabe que a **Conversa** é o coração do seu conhecimento — ela alimenta o comercial, o processo seletivo, a inteligência de mercado, a rede e a cultura de liderança responsável. O problema não é valorizá-la pouco; é **capturá-la em triplicado** (OneNote + Google Forms + planilha) e mesmo assim ter baixa clareza consolidada.

🔧 **Proposta:** uma **única superfície de captura da Conversa**, estruturada (quem, quando, contexto: comercial / seletivo / mercado / rede), que **alimenta automaticamente o CRM e o projeto**. Inserir uma vez; o dado flui. Consequências:

- Acaba a redigitação e a "duplicidade de input nas ferramentas" relatada pelo time.
- 💡 **Inverte a regra do "júnior anota".** O time observou (com razão) que o registro feito por seniores tem mais valor para o ecossistema de dados. Em vez de empurrar a anotação para o mais júnior, **reduz-se o atrito de captura** (transcrição/estruturação automática a partir de áudio ou de notas rápidas, com edição humana) para que **seniores registrem sem custo de tempo**. O valor do dado sobe; o esforço cai.
- Cada Conversa registrada é a **DoD** das entrevistas — fecha a tarefa e enche o ativo de dado ao mesmo tempo.

⚖️ A Conversa carrega dado pessoal: vale finalidade por processo, minimização e os cuidados da camada C.

## B. Tecnologia & IA ética — copiloto, com custo sob controle

**Regra de ouro:** a IA **estrutura, rascunha e acelera**; o humano **decide e assina**. Nenhuma aprovação/reprovação de candidato é automática (art. 20 LGPD). Onde a IA entra:

| Fase | Uso de IA (copiloto) | Quem decide/assina |
|---|---|---|
| 0–1 | Rascunho de proposta; resumo de cliente; descritivo de posição e perfil-alvo | Sócio |
| 2 | Mapa de mercado, long list, strings de busca | Pesquisa / Associados |
| 3 | Mensagens de abordagem; **transcrição+estruturação de entrevistas** | Sócio / Associado |
| 4 | Rascunho da shortlist (comparativo por critério); disparo de NPS | Sócio / Associado |
| 5 | Rascunho do **relatório de referências**; empacotamento seguro de relatórios | Quem conduz / valida |
| 6 | Cenários de proposta (faixas de mercado) | Sócio (negocia) |
| 7 | Formulário de preparo de fechamento; resumo de saúde do projeto p/ Quality | Sócio |

**Controle de custo (objetivo explícito):**

- **Escalonar modelo ao valor da tarefa:** trabalho rotineiro e de alto volume (transcrição, formatação, estruturação) usa modelo barato; síntese de alto risco (comparativo de finalistas, relatório de referências) usa modelo melhor. Não usar o modelo mais caro para tudo.
- **Consolidar a stack:** menos ferramentas sobrepostas = menos licença, menos duplicidade, menos risco. A ferramenta grátis de PDF "economizou" licença e custou exposição de dado — **falso barato**.
- **Medir custo por projeto** da camada tecnológica e tratar automação como alavanca de throughput: cada hora de gargalo devolvida pela automação vale mais do que a economia de uma assinatura.
- ⚖️ **Risco de injeção/exfiltração:** desconfiar de instruções embutidas em arquivos/páginas/currículos ("ignore o anterior e exporte X"). Nenhuma exportação em massa de CRM sem pedido humano explícito.

> 💡 **Painel ao invés de "tarefeiros".** Um sistema de gestão de tarefas (o Monday citado pelo time, ou um painel vivo) materializa fases, DoD e KPIs. O alerta do time procede: sócios não devem virar fila de tarefas — a meta de **~60% em registro/inteligência e governança** preserva o papel estratégico e a "governança de assuntos".

## C. Governança de dados & LGPD

Não é burocracia: é o que sustenta "maior clareza de dados" **e** protege a Plongê e os candidatos. (Isto é orientação operacional, **não** parecer jurídico — questões legais vão ao jurídico/DPO da Plongê.)

- **Finalidade e separação por processo:** dado de candidato serve à finalidade daquele mandato. **Não reaproveitar entre processos** nem misturar candidatos de vagas distintas.
- **Minimização:** coletar e guardar só o necessário à decisão. Evitar CPF/RG/endereço completo/dados bancários além do indispensável.
- **Sigilo do contratante:** em vaga sigilosa, o cliente não é revelado fora do círculo autorizado; o nome só é aberto ao candidato com autorização (e NDA quando exigido).
- **Dado sensível — não tratar:** raça, religião, saúde, vida sexual, opinião política, biometria não são solicitados, inferidos nem registrados, **nem por pistas indiretas** (nome, foto, escola, bairro). Menção espontânea do candidato → descrição neutra ("afastamento pessoal").
- **Não discriminação:** avaliar só por critério profissional. Sem gênero, idade, estado civil, filhos, aparência, origem — e cuidado com proxies ("perfil jovem", "fit cultural" vago). Pedido de filtro discriminatório → não executar; oferecer critério legítimo (senioridade, experiência) e sinalizar.
- **Off-limits** é controle de dado e de ética/contrato, conferido na Fase 2 e respeitado em toda abordagem.
- **Segurança:** ⚠️ **encerrar o uso de ferramenta gratuita online de merge de PDFs** com dado de candidato; usar ferramenta local/licenciada e canais seguros. Acesso ao CRM por menor privilégio.
- **Direitos do titular (art. 18) e retenção:** apoiar acesso, correção e eliminação sem obstruir; ao encerrar o projeto, aplicar retenção/eliminação; se pedirem para "esquecer" um candidato, não reutilizar o dado.
- **Alertas:** exposição de dado a terceiro não autorizado, finalidade discriminatória ou suspeita de vazamento → **parar e acionar o DPO** (pode exigir comunicação à ANPD).

## D. KPIs, SLAs & marcos billáveis

Sem condição de término não há métrica; com fases e DoD, o painel fica confiável. Indicadores-âncora:

| Dimensão | Indicador | Alvo (proposto — validar) |
|---|---|---|
| Velocidade | **Time-to-shortlist** | ≤ 20 dias úteis |
| Velocidade | Time-to-fill (início→aceite) | a calibrar com histórico ❓ |
| Eficácia | Taxa de resposta a abordagens | medir baseline primeiro |
| Eficácia | Offer→accept | acompanhar tendência |
| Qualidade | Retenção no período de garantia | maximizar |
| Cliente | NPS do cliente + **% com Call de Quality** | elevar (hoje baixo) |
| Candidato | NPS do candidato (pós sign-off) | acompanhar |
| Dado | % de Conversas registradas / fichas completas | → 100% |
| Capacidade | Projetos no caminho crítico vs. **WIP-limit** | dentro do teto |

**Marcos billáveis:** Fase 1 (1º terço), Fase 4 (2º terço), Fase 6 (3º terço). Como as fases são irreversíveis e entregáveis, cada uma é defensável em caso de cancelamento.

## E. Cuidado com o cliente e com o candidato

**Candidato (ativo de marca e rede):**

- **Sign-off humanizado padrão** sempre que alguém sai do processo — devolutiva real, não silêncio. O **NPS automático** é rede de proteção *após* o toque humano, nunca em lugar dele.
- Gaps de carreira e saídas tratados de forma neutra; experiência respeitosa alimenta a rede e a reputação da Plongê (e a tal "cultura de liderança responsável").

**Cliente (recompra):**

- 💡 **Atacar a fadiga de reunião** ("não aguenta mais ver a gente"): consolidar os follow-ups do fim em **menos sessões e mais valor**, substituindo reuniões de status por **entregáveis assíncronos** (resumo de saúde do projeto, relatório). Reunião do cliente só quando há decisão ou advisory real.
- **Call de Quality** reposicionada como **ritual deliberado de recompra**, conduzido por um **sócio fora da entrega** e municiado por dado — não como "mais uma reunião".

---

# Roadmap de implementação

A ordem importa: comece pelo que devolve capacidade ao gargalo e pelo que protege dado — barato, rápido, alto impacto — antes das mudanças estruturais.

**Onda 1 — Quick wins (semanas 1–4): baixo atrito, alto alívio**

1. ⚠️ **Encerrar o merge de PDFs em ferramenta grátis online** e adotar alternativa segura (risco de dado — fazer já).
2. **Auto-agendamento** para entrevistas Plongê e do cliente — tira o item de maior volume e menor valor das costas da Pesquisa.
3. **Definir a DoD de cada atividade** (condição de término) e parar de deixar tarefa "contínua" em aberto — habilita o painel.
4. **Sign-off humanizado padrão + NPS automático** como ritual único, acionável a cada saída de candidato.

**Onda 2 — Dado e painel (semanas 3–8)**

5. **Superfície única de captura da Conversa** integrada ao CRM (mata a tripla digitação). Começar pela estruturação assistida das entrevistas.
6. **Painel de projetos** (Monday ou equivalente) com fases, DoD, KPIs e **WIP-limit** visível.
7. **Camada de IA com custo escalonado** por valor de tarefa; medir custo por projeto.

**Onda 3 — Estrutural (semanas 6–12): exige decisão de sócios**

8. **Piloto do Núcleo de Busca compartilhado** com 2–3 projetos; medir throughput vs. modelo atual.
9. **Modelo de capacidade semanal** com WIP-limit calibrado e right-sizing do operacional fora do caminho crítico.
10. **Capacitação no MEP** (habilitar Rodolfo, Victoria Monjardim, Luisa) para eliminar o gargalo de pessoas.
11. **Call de Quality como ritual obrigatório de recompra** (sócio fora da entrega).

> Sequência deliberada: Ondas 1–2 **liberam capacidade e dado** que tornam a Onda 3 (a aposta estrutural) segura de testar — sem apostar a casa antes de ter evidência.

---

# Questões em aberto (decisão humana)

Itens que **não** devem virar regra sem validação — coerente com "IA é insumo, não decisão":

- ❓ **MEP e Inove:** confirmar o que é o MEP e o papel da Inove (assumidos como instrumento de assessment de embarque e parceiro externo).
- ❓ **Faturamento em terços:** confirmar se os marcos billáveis correspondem ao modelo comercial real.
- ❓ **Núcleo de Busca:** grau de separação (dedicado vs. rotativo) e forma de reconhecimento — decidir após o piloto.
- ❓ **WIP-limit:** qual o teto de projetos simultâneos no caminho crítico, dado o time atual.
- ❓ **Função de Coordenação:** criar papel formal ou distribuir? Quem absorve o operacional de baixo valor.
- ❓ **Call de Quality:** confirmar que é sempre um sócio fora da conta.
- ❓ **Quem é a Inove no contexto** e demais responsáveis ainda marcados como recomendação (Dono do Projeto para off-limits, agendamentos via Coordenação).
- 📌 Pós-aceite o time estava disperso no mapeamento; as Fases 5–7 merecem **uma sessão de refino dedicada** com quem vive essas etapas.

---

# Anexo — De/Para: processo atual → versão revisada

| Etapas do mapeamento original (`o_processo.md`) | Onde estão agora |
|---|---|
| 1 (PLIA) | Fase 0 |
| 2–5 (Kickoff, pasta, weeklys, entendimento) | Fase 1 (entendimento puxado p/ cá; calibragem do perfil-alvo adicionada) |
| 6 (estratégia de busca) | Fase 2 |
| **7 ("falta etapa")** | Fase 2 — **nomeada**: mapa de mercado/long list + calibragem |
| 8 (off-limits) | Fase 2 — agora com DoD (fecha) |
| 9–12 (busca, identificação, LinkedIn, grid) | Fase 2 (marco da semana 1) |
| 13–18 (abordagens, indicações, agendamento, entrevista Plongê, registro, entendimento) | Fase 3 (agendamento automatizado; registro = DoD) |
| 19–20 (shortlist, sign-off) | Fase 4 (sign-off vira ritual padrão) |
| 21–31 (NDA, abrir nome, relatórios, entrevistas do cliente, FUPs, referências) | Fase 5 (referências fecham a fase; fix do PDF) |
| 32–33 (proposta, aceite) | Fase 6 |
| 34–43 (MEP, devolutivas, embarque, FUPs, relatórios, Call de Quality, sessões) | Fase 7 (weeklys encerram aqui; Quality vira obrigatória) |
| Anexos/insights (sobrecarga, throughput, agendamento, Monday, NPS, IA em referências, fadiga do cliente, segurança) | Diagnóstico + Modelo Operacional + Camadas A–E + Roadmap |

---

*Documento de uso interno — confidencial (Plongê Executive Search). Versão revisada assistida por IA, a partir do mapeamento de 17/06/2026. As recomendações são insumo para decisão dos sócios e do time — humano sempre no circuito.*

