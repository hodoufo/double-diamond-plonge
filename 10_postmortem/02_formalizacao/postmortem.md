# Postmortem Projeto de Construção do Plia

## O que foi o projeto

O projeto consistiu na construção de uma plataforma proprietária para a Plonge gerir seus processos de recrutamento. Havia a premissa de que o desenvolvimento fosse internalizado, com a construção de um sistema "simples" que possibilitasse a redução dos custos de software — na época o Invenias era utilizado, porém apresentava limitações como pouca customização, baixa capacidade de extração de indicadores e custos expostos a dólar.

Havia uma necessidade de ganho em autonomia e padronização sobre as operações e flexibilidade no fluxo dos processos, além do desejo de integrar melhor as informações e gerar relatórios mais facilmente. A falta de visibilidade dos dados, citada em vários relatos, foi um fator impeditivo para tomadas de decisão rápidas e assertivas no negócio durante o período analisado, de 2022 a 2025.

Por fim, o sentimento geral, extraído dos relatos, era de forte aposta do time em construir uma solução própria que trouxesse mais controle, economia e evolutividade para o negócio da Plonge - que se frustrou após longo período de investimento sem evidente retorno ao negócio.

O momento atual da Plongê é de repensar a estratégia de tecnologia e produto digital à luz da entrada de novos sócios na sociedade, do ruim momento financeiro (outubro de 2025), e da incerteza sobre como lidar com o legado construido do sistema Plia.

## Linha do tempo

### 2022
- **Abril**: **Bluecore** é contratada para construção do módulo comercial (que Yuri - sistema proprietário da YU, que vinha sendo avaliado para substituir o Invenias no projeto "**Yuri na Plongê"** - já não cobria). 
- Módulo comercial começa a ser usado via **Pipedrive**
- **Agosto**: Saída do sócio de tecnologia da YU, Sal, que atuava como ponte institucional entre YU e Plongê.
- **Setembro**: Renata e Analu saem da sociedade da YU, e o projeto "Yuri na Plongê" é abortado. Situação de sistema CRM em construção (com a Bluecore), mas parte de candidatos (ATS) descoberto. Iniciam conversas com a Bluecore sobre a construção de um módulo de candidatos dentro do sistema que vinha sendo envisionado.
- **Outubro**: Comparações iniciais entre Yuri, Invenias e "Sistema Plonge" (ainda não se chamava Plia)
- Houve **decisão emocional de construção do ATS**, não foram avaliados escopo ou custos totais da empreitada. Iniciou-se o trabalho junto à fábrica de software em modelo "**taxímetro**", onde ía-se trabalhando nas demandas que surgiam em **reuniões frequentes de alinhamento de escopo de construção** (eles ficaram responsáveis pelo design da solução) antes mesmo de algum MVP para o sistema ser pensado (**muitos meses de esforço sem entrada de software em ambiente produtivo e operação por usuários reais**)
- A fase de desenho de protótipo da parte de candidatos durou 9 meses para ser finalizada - após tempo similar de construção de protótipo para o CRM (que em meados do final de 2022 já estava começando a ser um sistema produtivo, dentro da infra de homologação da Bluecore)

### 2023
- Conselho dá feedback negativo à gestão pois foi tomada decisão de construção de software sem que o conselho fosse consultado.
- **Junho** - Design do módulo de candidaturas (que foi iniciado no fim de 22) ainda não estava 100% apaziguado (sensação de "quase pronto")
- **Outubro**: Nasce o _app.plonge_ em produção. Foram exportados 456 arquivos de planilha do Invenias a fim de ser base do histórico a ser consultado futuramente.
- Ao final de 23 leads comerciais foram importados para o Plia, findando o uso do **Pipedrive**.
- **Novembro**: Fim da fase desenho do módulo de candidatura (ATS) para o Plia.
- Mudança de modelo de contrato com a Bluecore de "taxímetro" para "escopos fechados" pois já existia desconforto sobre investimento realizado. Após meses de projeto foram atentados ao fato de que já haviam gasto mais que o planejado, mesmo sem o sistema produtivo (ainda era necessário realizar investimentos adicionais para resolver bugs criticos, que foram empacotados em projetos de escopo mais definido)
- **Dezembro**: Decisão de ida à produção. Desligamento do Invenias. Sensação de "hora de tirar o band aid e ver onde dói". Forte expectativa de "estar tudo pronto".

### 2024
- **Fevereiro**: Todos os projetos ativos foram migrados para o Plia
- **Março**: O ATS estava plenamente produtivo.
- **Abril**: Leo Pabon foi contratado, pois havia clareza de que era necessária condução técnica, uma capability que a Plongê ainda não contava. Foram feitos Workshop de produto de forma a criar coesão entre visão de produto do sistema.
- **Outubro**: Entrada de fato do Léo como CPTO as a service, listando bugs, acompanhando desenvolvimentos com a fábrica, e atuando como Product Owner.
- Ao final do ano foi negociada gratuidade na resolução de lista acordada de bugs com gratuidade com a Bluecore (assuntos críticos que foi entendido que eram problemas de qualidade na entrega - portanto deveriam estar dentro de garantias). 

### 2025
- Foi construido um painel no Looker que consulta histórico do Invenias, as 456 planilhas levantadas em 2023.
- Houve "uso mais efetivo" do sistema, que de fato passou a integrar o dia a dia do time - que começou a ter dificuldades especialmente com duplicidade de trabalhos operacionais e gestão orientada a dados.
- Excel passou a ser fortemente utilizado pelo time, cobrindo features que não existem no Plia
- Dificuldade de se ter uma visão de dados dos projetos pois informações não estavam sendo imputadas no sistema
- Bluecore termina lista de bugs, e resta lista de bugs mapeados, descritos e precificados - que a Plongê não sabe se deve priorizar construção (e investimento), ou se realiza um _stop loss_ com o assunto. É decidido um congelamento do desenvolvimento no sistema até que se haja estratégia para o assunto.
- **Setembro**: Sal é contratado como consultor de estratégia técnica para a Plongê. Relato de "e agora? o que fazer com o Plia?"
- Leo finaliza escopo de atuação com a criação de um Service Blueprint
- Luisa entra como sócia; Stefani é promovida a sócia. Época de rediscussões de estratégia na Plongê.
- Sal após entrevistas e workshops com todos da empresa sugere que seja feito um momento de discussão sobre o que foi o projeto de construção do Plia, de forma a facilitar que haja olhar apreciativo e de aprendizado sobre o projeto (o Plia foi o primeiro projeto de construção de software da empresa).
- **Outubro**: Momento de escrita deste postmortem. Foi feito um encontro presencial com todos da Plongê: de analistas a sócios.

## O que deu certo
- Iniciativa e coragem de construir algo próprio — mergulhamos nessa juntos e, se não tivéssemos iniciado, ficaríamos sempre no "e se...?"
- Aprendizado empreendedor significativo, com experimentação e criatividade para desenvolver
- Contratação do Leo, que trouxe conhecimento técnico e capacidade de traduzir desejos para a fábrica
- Implacável resiliência da Gabi, que foi a pessoa do time Plongê que esteve mais próxima da construção junto com Leo e a fábrica
- Processo iterativo de melhorias — uso de 3 planilhas para testar e priorizar continuamente
- Base de dados própria unificada (ATS + CRM), que não tínhamos antes
- Design do Plia com distribuição de projetos melhor que o Invenias
- Customização das telas de acordo com nosso processo, resultando em um sistema com a cara da Plongê
- Processo de desenho das telas trouxe visão clara do nosso serviço do início ao fim, em cada etapa
- Momentos de conversas difíceis, como o postmortem, que reforçam a Plongê como empresa

## O que não deu tão certo assim
- Módulo de candidatura com funcionalidades limitadas comparado ao Invenias: falta de tagueamento de candidatos em categorias, dados como cidade, filtros por empresas, motivos de reprovação e extração mais detalhada
- Tomada de decisão pouco embasada, mais emocional do que racional, sem buscar referências ou benchmark antes de iniciar
- Ausência de pessoa de tecnologia desde o início do projeto, o que teria minimizado problemas
- Interface com a fábrica poderia ter sido melhor, mais fluida e rápida — falta de um PO/Gestor que entendesse do projeto e tecnologia
- Comunicação do investimento inicial deveria ter sido melhor, assim como a definição inicial do porquê criar um novo sistema e o percurso dessa jornada
- Foco excessivo no sonho e negligência do básico ("arroz e feijão"), com decisões tomadas por impulsividade
- Time com baixa maturidade para decidir e/ou refutar sócios, gerando mentalidade de "nós versus eles"
- UX ruim e usabilidade aquém do esperado
- Engajamento do time como um todo poderia ter sido melhor, com mais clareza do que estava acontecendo e mentoria adequada, dado que software não é nossa prática
- Falta de conversas frequentes sobre o que não estava dando certo
- Processo de gestão de mudança poderia ter sido melhor conduzido, o que talvez fizesse o time ser menos resistente
- Extração de dados ruim, com falta de informações importantes
- Relação de confiança com a fábrica foi prejudicada

## Aprendizados
- Ter as etapas do processo sendo concluídas foi uma vitória — agora sabemos o que queremos e o que não queremos
- Temos um sistema nosso e personalizável, com destaque para a página de gestão de candidatos (clica e abre WhatsApp e email), feature que deu muito certo por ter sido construída de maneira mais ágil
- Usabilidade deve ser pensada para ser mais simples desde o início. UX é uma disciplina importante.
- Não subestimar o custo das mudanças e avaliar o que realmente "mexe o ponteiro" antes de investir
- Começar projetos e investimentos sempre guiados por um especialista, consultando pessoas especializadas de confiança quando não temos 100% do conhecimento
- Não entrar em nada só na emoção — decisões devem ser baseadas em dados e estratégia, com participação de todos
- Sempre combinar o preço por entrega/empreitada, não trabalhar em modelo "taxímetro"
- Fundamental ter um dono técnico que entenda do projeto desde o início
- Melhor mapeamento de riscos e clareza do objetivo sempre
- Looker podia ter sido construído antes — o Invenias voltava a ser acessado por uma só conta compartilhada para consultar histórico
- Gestão de mudança é essencial e deve ser planejada adequadamente
- Aprendemos minimamente sobre tecnologia, o que foi muito valioso
- Integrações são importantes e é necessário ter um sistema integrado
- Esperamos ter encerrado o ciclo das tomadas de decisão desembasadas, pensando sempre na Plongê e no lucro

## Conclusão e Follow-up Actions
O projeto do Plia simboliza um capítulo de grande importância na história da Plongê — um ciclo marcado por coragem, dedicação e pioneirismo. É fortemente reconhecido o valor de cada passo dado até aqui: mesmo diante dos desafios, a Plongê cresceu como equipe e foram dados passos em direção a quem a Plongê vislumbra ser como empresa. Todo o aprendizado adquirido é fruto do empenho coletivo, das tentativas, dos acertos e, principalmente, das superações diárias. Este postmortem é uma construção coletiva feita por todos da empresa, e registrada pelo consultor externo Rodofo Sousa (Sal).

Há sentimento de gratidão pelo caminho percorrido, certos de que construiu as bases para novas etapas desenhadas de maneira mais estratégica, madura e direcionada. Prontos para enfrentar os próximos desafios com mais clareza, colaboração e foco em resultados que realmente importam para a Plongê.

