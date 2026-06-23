/** Negócios no Pipeline — barras horizontais (Planilha vs Plia), alinhado ao produto atual */
export const commercialPipeStages = [
  {
    id: '1',
    title: 'A ser trabalhado',
    source: 'planilha',
    count: 61,
    barBg: '#d2ada5',
  },
  {
    id: '2',
    title: 'Reunião agendada',
    source: 'planilha',
    count: 16,
    barBg: '#c0807a',
  },
  {
    id: '3',
    title: 'Em andamento',
    source: 'planilha',
    count: 34,
    barBg: '#98716b',
  },
  {
    id: '4',
    title: 'Proposta enviada',
    source: 'plia',
    count: 13,
    barBg: '#2dd4bf',
    pipelineValue: 'R$ 2,1MM',
    missingValueNote: '2 neg. s/ $$$',
  },
  {
    id: '5',
    title: 'Deal em entendimento',
    source: 'plia',
    count: 11,
    barBg: '#0f766e',
    pipelineValue: 'R$ 1,3MM',
    missingValueNote: '2 neg. s/ $$$',
  },
] as const

export type CommercialPipeStage = (typeof commercialPipeStages)[number]

/** Extrai milhões de R$ de strings como `R$ 2,1MM` (vírgula decimal, convenção BR). */
export function parsePipelineValueMillions(pipelineValue: string): number {
  const cleaned = pipelineValue.replace(/\s/g, '').replace(/^R\$/i, '').replace(/MM$/i, '')
  const [whole, frac] = cleaned.split(',')
  if (frac !== undefined) {
    return parseFloat(`${whole}.${frac}`) || 0
  }
  return parseFloat(cleaned.replace(',', '.')) || 0
}

/**
 * Resumo do pipe para o cabeçalho contextual.
 * - `totalDeals`: Σ `commercialPipeStages[].count` (todas as etapas).
 * - `nextMonthRevenueMm`: Σ dos valores `pipelineValue` das etapas que os têm (forecast próximo mês, mock).
 */
export function getPipelineSummary(): {
  totalDeals: number
  nextMonthRevenueMm: number
} {
  const totalDeals = commercialPipeStages.reduce((sum, s) => sum + s.count, 0)
  const nextMonthRevenueMm = commercialPipeStages.reduce((sum, s) => {
    if ('pipelineValue' in s && s.pipelineValue) {
      return sum + parsePipelineValueMillions(s.pipelineValue)
    }
    return sum
  }, 0)
  return { totalDeals, nextMonthRevenueMm }
}

/** Mock agregado alinhado ao funil — valores derivados de `commercialPipeStages`. */
export const pipelineSummaryMock = {
  get totalDeals(): number {
    return getPipelineSummary().totalDeals
  },
  get nextMonthRevenueMm(): number {
    return getPipelineSummary().nextMonthRevenueMm
  },
}

/** Ex.: 2,3 → `R$ 2,3MM` (uma casa decimal, vírgula BR). */
export function formatMillionsBRL(mm: number): string {
  const rounded = Math.round(mm * 10) / 10
  const [intPart, decPart] = rounded.toFixed(1).split('.')
  return `R$ ${intPart},${decPart}MM`
}

const SOURCE_LABEL: Record<CommercialPipeStage['source'], string> = {
  planilha: 'Planilha Contatos',
  plia: 'Plia',
}

export function commercialPipeSourceLabel(
  source: CommercialPipeStage['source'],
): string {
  return SOURCE_LABEL[source]
}

/** Status operacional do projeto (mock) — filtro da lista em `/projects`. */
export type ProjectOperationalStatus = 'em_andamento' | 'pausado' | 'concluido'

export type RunningProject = {
  id: string
  name: string
  client: string
  /** Empresa cliente — alinha com `companies[].id` para links de navegação. */
  clientCompanyId: string
  /** Negócio (deal) de onde o projeto deriva — alinha com `deals[].id`. */
  dealId: string
  /** Etapa do processo de recrutamento (ATS), não confundir com ciclo de entrega. */
  stage: string
  status: ProjectOperationalStatus
  dataInicio: string
  dataFimPrevista: string
  owner: string
  /** Placeholder até integração com financeiro. */
  orcamentoPlaceholder: string
  /** Uma frase: o que se busca neste projeto (superfície «negócio»). */
  objectiveBrief: string
}

export const runningProjects: RunningProject[] = [
  {
    id: 'p1',
    name: 'Search — Eng. Sênior',
    client: 'Aurora Labs',
    clientCompanyId: 'co1',
    dealId: 'd1',
    stage: 'Entrevistas',
    status: 'em_andamento',
    dataInicio: '10/02/2025',
    dataFimPrevista: '30/06/2025',
    owner: 'Ana Ribeiro',
    orcamentoPlaceholder: 'A definir (mock)',
    objectiveBrief:
      'Engenheiro(a) sênior com sistemas distribuídos, liderança técnica e calibração para board com CTO.',
  },
  {
    id: 'p2',
    name: 'Product — PM',
    client: 'Nilo',
    clientCompanyId: 'co2',
    dealId: 'd2',
    stage: 'Shortlist',
    status: 'em_andamento',
    dataInicio: '03/03/2025',
    dataFimPrevista: '15/07/2025',
    owner: 'Carlos Mota',
    orcamentoPlaceholder: 'R$ 120k — estimativa interna',
    objectiveBrief:
      'Product manager com discovery forte em fintech e ritmo junto a squads de engenharia e design.',
  },
  {
    id: 'p3',
    name: 'Data — Lead',
    client: 'Vértice',
    clientCompanyId: 'co3',
    dealId: 'd3',
    stage: 'Kickoff',
    status: 'em_andamento',
    dataInicio: '21/04/2025',
    dataFimPrevista: '30/09/2025',
    owner: 'Letícia Nunes',
    orcamentoPlaceholder: 'Escopo fechado — detalhe em ERP (mock)',
    objectiveBrief:
      'Lead de dados que una governança, analytics avançado e priorização com o roadmap da Vértice.',
  },
]

export function getProjectsByDealId(dealId: string): RunningProject[] {
  return runningProjects.filter((p) => p.dealId === dealId)
}

/** Fases do ciclo de vida da entrega (pipeline típico). */
export type ProjectLifecycleStage = {
  id: string
  label: string
  status: 'concluida' | 'em_andamento' | 'pendente'
  periodo?: string
  detalhe?: string
}

/**
 * Etapas por projeto — inspiradas em kickoff, descoberta, construção, UAT, go-live.
 * referência fotográfica: timeline vertical na superfície principal (protótipo).
 */
export const projectStagesByProjectId: Record<string, ProjectLifecycleStage[]> = {
  p1: [
    {
      id: 'kickoff',
      label: 'Kickoff e contrato',
      status: 'concluida',
      periodo: 'Fev/2025',
      detalhe: 'Alinhamento de SLA, perfil e calendário de entrevistas.',
    },
    {
      id: 'discovery',
      label: 'Descoberta e refinamento de perfil',
      status: 'concluida',
      periodo: 'Fev–Mar/2025',
      detalhe: 'Entrevistas com hiring manager e definição de barreira técnica.',
    },
    {
      id: 'build',
      label: 'Construção do funil e sourcing',
      status: 'em_andamento',
      periodo: 'Mar/2025',
      detalhe: 'Pipeline ativo; triagem e entrevistas em curso.',
    },
    {
      id: 'uat',
      label: 'Homologação com o cliente',
      status: 'pendente',
      detalhe: 'Validação de shortlist final e oferta.',
    },
    {
      id: 'golive',
      label: 'Go-live e operação',
      status: 'pendente',
      detalhe: 'Onboarding do candidato e encerramento formal do projeto.',
    },
  ],
  p2: [
    {
      id: 'kickoff',
      label: 'Kickoff e contrato',
      status: 'concluida',
      periodo: 'Mar/2025',
    },
    {
      id: 'discovery',
      label: 'Descoberta e mapeamento de competências',
      status: 'em_andamento',
      periodo: 'Mar–Abr/2025',
      detalhe: 'Workshops com produto e definição de senioridade.',
    },
    {
      id: 'build',
      label: 'Construção do funil',
      status: 'pendente',
    },
    {
      id: 'uat',
      label: 'Homologação com o cliente',
      status: 'pendente',
    },
    {
      id: 'golive',
      label: 'Go-live e operação',
      status: 'pendente',
    },
  ],
  p3: [
    {
      id: 'kickoff',
      label: 'Kickoff e contrato',
      status: 'em_andamento',
      periodo: 'Abr/2025',
      detalhe: 'Primeira semana — workshops e plano de sourcing.',
    },
    {
      id: 'discovery',
      label: 'Descoberta de mercado e perfil',
      status: 'pendente',
    },
    {
      id: 'build',
      label: 'Construção do funil',
      status: 'pendente',
    },
    {
      id: 'uat',
      label: 'Homologação com o cliente',
      status: 'pendente',
    },
    {
      id: 'golive',
      label: 'Go-live e operação',
      status: 'pendente',
    },
  ],
}

export function getRunningProjectById(id: string): RunningProject | undefined {
  return runningProjects.find((p) => p.id === id)
}

export function getProjectLifecycleStages(projectId: string): ProjectLifecycleStage[] {
  return projectStagesByProjectId[projectId] ?? []
}

export type UpcomingTask = {
  id: string
  title: string
  due: string
  done: boolean
  /** Negócio ao qual a tarefa está ligada (`deals[].id`). */
  dealId: string
  /** Contatos envolvidos (`contacts[].id`). */
  contactIds: string[]
}

export const upcomingTasks: UpcomingTask[] = [
  {
    id: 't1',
    title: 'Retomar com João (Aurora)',
    due: 'Hoje',
    done: false,
    dealId: 'd1',
    contactIds: ['c1'],
  },
  {
    id: 't2',
    title: 'Enviar proposta Nilo',
    due: 'Amanhã',
    done: false,
    dealId: 'd2',
    contactIds: ['c2'],
  },
  {
    id: 't3',
    title: 'Sincronizar com time Vértice',
    due: 'Sex',
    done: true,
    dealId: 'd3',
    contactIds: ['c3'],
  },
]

export function getTasksByDealId(dealId: string): UpcomingTask[] {
  return upcomingTasks.filter((t) => t.dealId === dealId)
}

export function getTasksByContactId(contactId: string): UpcomingTask[] {
  return upcomingTasks.filter((t) => t.contactIds.includes(contactId))
}

/** Tarefas do negócio associado ao projeto (`runningProjects[].dealId`). */
export function getTasksByProjectId(projectId: string): UpcomingTask[] {
  const pr = runningProjects.find((p) => p.id === projectId)
  if (!pr) return []
  return getTasksByDealId(pr.dealId)
}

export type ContactExperience = {
  cargo: string
  empresa: string
  periodo: string
  descricao: string[]
}

/** Currículo estruturado (PT-BR) — superfície principal ao focar o contato */
export type ContactCurriculum = {
  resumo: string[]
  experiencia: ContactExperience[]
  formacao: string[]
  competencias: string[]
}

/** Eixos comerciais — valor único por contato. */
export const CONTACT_STRATEGIES = [
  'Serviços Financeiros e Investimentos',
  'Indústria, Energia e Infraestrutura Verde',
  'Agro, Logística e Cadeias Produtivas',
  'Saúde, Biotecnologia e Bem-estar',
  'Tecnologia, IA e Digitalização',
  'Transformação Organizacional / ESG / Governança',
  'Farming Plongê',
  'Eletromobilidade',
  'Biogás / Biometano',
  'Transmissão',
  'Conselho',
  'Impacto / Ecossistema B',
  'Família Empresária',
  'Etanol',
] as const
export type ContactStrategy = (typeof CONTACT_STRATEGIES)[number]

export const CONTACT_ORIGINS = [
  'Prospect',
  'Cliente Ativo',
  'Indicação cliente',
  'Indicação Parceiro',
  'Relacionamento',
  'Ex Cliente',
  'Candidato',
  'Referências',
  'CS',
  'Parceiros',
  'Fornecedor',
] as const
export type ContactOrigin = (typeof CONTACT_ORIGINS)[number]

export const CONTACT_STATUSES = [
  'Não Trabalhar',
  'A ser trabalhado',
  'Tentativa de Contato',
  'Sem Retorno',
  'Reunião Agendada',
  'Sem Demanda no momento',
  'Negociando proposta',
  'Em andamento',
  'Cliente Ativo',
  'Proposta perdida',
] as const
export type ContactStatus = (typeof CONTACT_STATUSES)[number]

export const contacts = [
  {
    id: 'c1',
    name: 'Marina Duarte',
    role: 'Head of People',
    company: 'Aurora Labs',
    companyId: 'co1',
    relation: 'quente' as const,
    estrategia: 'Transformação Organizacional / ESG / Governança' as ContactStrategy,
    origem: 'Cliente Ativo' as ContactOrigin,
    status: 'Cliente Ativo' as ContactStatus,
    curriculum: {
      resumo: [
        'Profissional de RH com quinze anos de experiência em empresas de tecnologia e escala internacional. Atuo na intersecção entre cultura, performance e dados — desenhando processos que mantêm ritmo de contratação sem sacrificar diversidade nem qualidade de experiência do candidato.',
        'Na Aurora Labs liderei a transformação do employer branding e da jornada do candidato, reduzindo tempo médio de fechamento de vagas seniores e criando rituais claros de feedback entre líderes e pessoas. Gosto de trabalhar próximo a founders e engenharia para traduzir prioridades de produto em planos de headcount realistas.',
      ],
      experiencia: [
        {
          cargo: 'Head of People',
          empresa: 'Aurora Labs',
          periodo: '2021 — presente',
          descricao: [
            'Definição da estratégia de people ops para ~800 colaboradores distribuídos em três fusos; parceria direta com CFO e CTO para orçamento e ramp-up de engenharia.',
            'Implementação de ciclo de talent review semestral conectado a trilhas internas e política de promoção transparente; participação ativa em comitês de inclusão e remuneração.',
            'Estruturação do time de talent acquisition com squads por senioridade e uso de ATS integrado a dados de funil (mock no protótipo).',
          ],
        },
        {
          cargo: 'People Partner Sênior',
          empresa: 'Horizonte Digital',
          periodo: '2016 — 2021',
          descricao: [
            'Suporte a squads de produto e dados em São Paulo e Lisboa; mediação de conflitos e desenho de planos de desenvolvimento individual alinhados a OKRs.',
            'Coordenação de programas de onboarding remoto durante expansão acelerada pós-serie B.',
          ],
        },
        {
          cargo: 'Analista de RH',
          empresa: 'Vias Consultoria',
          periodo: '2010 — 2016',
          descricao: [
            'Recrutamento e seleção para clientes de serviços financeiros; facilitação de workshops de cultura e clima organizacional.',
          ],
        },
      ],
      formacao: [
        'MBA em Gestão de Pessoas — FGV (2018)',
        'Psicologia — USP, Bacharelado (2006 — 2010)',
        'Certificação SHRM-SCP (2020)',
      ],
      competencias: [
        'People strategy',
        'Talent acquisition',
        'Cultura e employer branding',
        'Facilitação e mediação',
        'People analytics (introdutório)',
        'Inglês fluente · Espanhol intermediário',
      ],
    } satisfies ContactCurriculum,
  },
  {
    id: 'c2',
    name: 'Ricardo Menezes',
    role: 'CTO',
    company: 'Nilo',
    companyId: 'co2',
    relation: 'morno' as const,
    estrategia: 'Tecnologia, IA e Digitalização' as ContactStrategy,
    origem: 'Indicação cliente' as ContactOrigin,
    status: 'Negociando proposta' as ContactStatus,
    curriculum: {
      resumo: [
        'Engenheiro de software com trajetória migrando de desenvolvimento individual para liderança técnica em startups B2B. Tenho obsessão por arquitetura evolutiva: sistemas que aguentam crescimento sem travar o time com cerimônias inúteis.',
        'Na Nilo, concentro-me em reduzir débito técnico invisível — o tipo que aparece quando integrações de vendas, billing e produto crescem em paralelo. Acredito em documentação mínima mas verdadeira, revisões leves e métricas que engenheiros realmente usam no dia a dia.',
      ],
      experiencia: [
        {
          cargo: 'CTO',
          empresa: 'Nilo',
          periodo: '2022 — presente',
          descricao: [
            'Liderança de ~35 engenheiros (backend, frontend, dados e plataforma); definição de roadmap técnico conjunto com produto e customer success.',
            'Introdução de práticas de observabilidade unificada e padronização de contratos de API entre microsserviços legados e novos módulos SaaS.',
            'Mentoria de staff engineers e desenho de calibragens de promoção técnica alinhadas a impacto no negócio.',
          ],
        },
        {
          cargo: 'Principal Engineer',
          empresa: 'Trilha Pagamentos',
          periodo: '2018 — 2022',
          descricao: [
            'Concepção do núcleo de processamento de conciliação em tempo quase real; redução de incidentes P1 via circuit breakers e runbooks compartilhados.',
            'Participação em comitê de segurança e revisão de desenho para integrações com adquirentes.',
          ],
        },
        {
          cargo: 'Software Engineer → Tech Lead',
          empresa: 'Cubo Labs',
          periodo: '2012 — 2018',
          descricao: [
            'Evolução de monólito modular para serviços com fronteiras claras; contratação dos primeiros desenvolvedores do chapter mobile.',
          ],
        },
      ],
      formacao: [
        'Ciência da Computação — Unicamp (2007 — 2011)',
        'Especialização em Arquitetura de Software — Coursera / referências industry (2019)',
      ],
      competencias: [
        'Arquitetura distribuída',
        'Liderança de engenharia',
        'Platform & observability',
        'API design',
        'Segurança aplicada',
        'Go · TypeScript · Kubernetes (uso cotidiano)',
      ],
    } satisfies ContactCurriculum,
  },
  {
    id: 'c3',
    name: 'Paula Azevedo',
    role: 'Founder',
    company: 'Vértice',
    companyId: 'co3',
    relation: 'frio' as const,
    estrategia: 'Impacto / Ecossistema B' as ContactStrategy,
    origem: 'Prospect' as ContactOrigin,
    status: 'Tentativa de Contato' as ContactStatus,
    curriculum: {
      resumo: [
        'Empreendedora na intersecção entre dados públicos, sustentabilidade e decisões corporativas. A Vértice nasceu da frustração de relatórios ESG genéricos que não conversavam com operações reais de cadeia de suprimentos.',
        'Negocio com CFOs e conselhos que precisam de narrativa auditável: não apenas métricas bonitas, mas trilha de evidências e comparáveis de mercado. Background misto em consultoria e produto digital.',
      ],
      experiencia: [
        {
          cargo: 'Fundadora & CEO',
          empresa: 'Vértice',
          periodo: '2020 — presente',
          descricao: [
            'Definição da visão de produto e primeiras rodadas com investidores focados em climate tech e dados.',
            'Construção de parcerias com institutos de pesquisa e órgãos públicos para enriquecer bases analíticas (protótipo — fluxos mockados).',
            'Gestão de equipe enxuta multidisciplinar: dados, design e customer research.',
          ],
        },
        {
          cargo: 'Diretora de Operações (fractional)',
          empresa: 'Rede AgroConsciente (projeto)',
          periodo: '2018 — 2020',
          descricao: [
            'Estruturação de indicadores de impacto ambiental para cooperativas; workshops com líderes locais e mapa de stakeholders.',
          ],
        },
        {
          cargo: 'Consultora Sênior',
          empresa: 'McKinsey & Company',
          periodo: '2013 — 2018',
          descricao: [
            'Projetos de transformação operacional e estratégia em varejo e matérias-primas; facilitação de workshops com C-level.',
          ],
        },
      ],
      formacao: [
        'MBA — INSEAD (2016)',
        'Engenharia de Produção — Poli-USP (2008 — 2012)',
      ],
      competencias: [
        'Estratégia e fundraising',
        'ESG e operações',
        'Storytelling executivo',
        'Pesquisa aplicada',
        'Português nativo · Inglês fluente · Francês avançado',
      ],
    } satisfies ContactCurriculum,
  },
  {
    id: 'c4',
    name: 'André Prado',
    role: 'CFO',
    company: 'Beta Analytics',
    companyId: 'co4',
    relation: 'morno' as const,
    estrategia: 'Serviços Financeiros e Investimentos' as ContactStrategy,
    origem: 'Indicação Parceiro' as ContactOrigin,
    status: 'Reunião Agendada' as ContactStatus,
    curriculum: {
      resumo: [
        'Financeiro estratégico com trajetória em scale-ups de dados e analytics B2B. Participo de rodadas de investimento desde preparação de dataroom até modelo de unit economics que investidores conseguem estressar em cenários adversos.',
        'Na Beta Analytics priorizo visibilidade de margem por produto e disciplina de caixa sem sufocar experimentação do time de produto — um equilíbrio que exige conversar a mesma língua com engenharia e vendas.',
      ],
      experiencia: [
        {
          cargo: 'CFO',
          empresa: 'Beta Analytics',
          periodo: '2023 — presente',
          descricao: [
            'Liderança do planejamento financeiro e relação com board; revisão trimestral de forecast com cenários macro e sazonalidade de contratos enterprise.',
            'Desenho de política de pricing e pacotes de serviço profissional associados à plataforma (protótipo).',
            'Implementação de controles SOC-adjacentes para pipeline de receita reconhecida vs. caixa.',
          ],
        },
        {
          cargo: 'VP Finance',
          empresa: 'Atlas Insights',
          periodo: '2019 — 2023',
          descricao: [
            'Escalonamento pós-serie A em mercado competitivo; negociação de linhas de crédito e hedge cambial para contratos internacionais.',
            'Parceria com produto na definição de métricas de retenção financeira e cohort reporting para clientes.',
          ],
        },
        {
          cargo: 'Controller → Diretor Financeiro',
          empresa: 'Grupo Cardoso Retail',
          periodo: '2012 — 2019',
          descricao: [
            'Consolidação multi-unidade e projeto de shared services de financeiro; integrações pós-M&A de redes regionais.',
          ],
        },
      ],
      formacao: [
        'MBA Finance — Kellogg (2015)',
        'Ciências Contábeis — FEA-USP (2007 — 2011)',
        'CPA equivalente / certificações em valuation (referências de mercado)',
      ],
      competencias: [
        'FP&A e fundraising',
        'M&A e integração',
        'Pricing B2B',
        'Governança e compliance financeiro',
        'Inglês fluente para negociação',
        'SQL e dashboards (uso colaborativo com dados)',
      ],
    } satisfies ContactCurriculum,
  },
] as const

export type Contact = (typeof contacts)[number]

/** Usuário logado (mock, opcional). Se ausente, o cumprimento usa o primeiro nome do primeiro contato. */
export const currentUser: { name: string } | undefined = {
  name: 'Marina Duarte',
}

export type Deal = {
  id: string
  name: string
  value: number
  /** Rótulo comercial (livre) */
  stage: string
  /** Alinha ao funil em `commercialPipeStages` (filtra a listagem por etapa). */
  pipeStageId: string
  prob: number
  companyId?: string
  contactIds?: string[]
}

export const deals: Deal[] = [
  {
    id: 'd1',
    name: 'Aurora — Eng. Sênior',
    value: 180_000,
    stage: 'Proposta',
    pipeStageId: '4',
    prob: 60,
    companyId: 'co1',
    contactIds: ['c1', 'c4'],
  },
  {
    id: 'd2',
    name: 'Nilo — PM',
    value: 95_000,
    stage: 'Qualificação',
    pipeStageId: '2',
    prob: 40,
    companyId: 'co2',
    contactIds: ['c2'],
  },
  {
    id: 'd3',
    name: 'Vértice — Data',
    value: 140_000,
    stage: 'Prospecção',
    pipeStageId: '1',
    prob: 25,
    companyId: 'co3',
    contactIds: ['c3'],
  },
]

/** Negócios do mock cuja etapa do pipe coincide com o id do funil (`commercialPipeStages`). */
export function dealsInPipeStage(pipeStageId: string): Deal[] {
  return deals.filter((d) => d.pipeStageId === pipeStageId)
}

export const projectPipeline = [
  { id: 's1', name: 'Sourcing', count: 8 },
  { id: 's2', name: 'Triagem', count: 5 },
  { id: 's3', name: 'Entrevistas', count: 3 },
  { id: 's4', name: 'Oferta', count: 1 },
]

export const candidates = [
  { id: 'a1', name: 'L. Ferreira', role: 'Eng. Sênior', project: 'Aurora', status: 'Entrevistas' },
  { id: 'a2', name: 'K. Okada', role: 'Eng. Sênior', project: 'Aurora', status: 'Triagem' },
  { id: 'a3', name: 'I. Costa', role: 'PM', project: 'Nilo', status: 'Sourcing' },
]

/** Utilizadores internos Plongê — participantes «internos» nas conversas. */
export type SystemUser = {
  id: string
  name: string
  role: string
}

export const systemUsers: SystemUser[] = [
  { id: 'u1', name: 'Ana Ribeiro', role: 'Account Lead' },
  { id: 'u2', name: 'Carlos Mota', role: 'Account Lead' },
  { id: 'u3', name: 'Letícia Nunes', role: 'Delivery Lead' },
  { id: 'u4', name: 'Bruno Teixeira', role: 'Growth / Comercial' },
]

export function getSystemUserById(id: string): SystemUser | undefined {
  return systemUsers.find((u) => u.id === id)
}

/** Metadado de conversa — transcrição editável fica na superfície Plia, não no painel. */
export type Conversation = {
  id: string
  title: string
  tags: string[]
  /** Frases curtas para a nuvem na lista de conversas */
  snippets: string[]
  excerpt: string
  /** Markdown ou parágrafos (PT-BR) */
  transcript: string
  /** Legado / resumo legível — também derivável de participantes estruturados */
  participants: string[]
  /** IDs em `systemUsers` */
  internalUserIds: string[]
  /** IDs em `contacts` (clientes / externos) */
  externalContactIds: string[]
  date: string
  channel: string
  /** Placeholder até gravação / integração */
  durationPlaceholder: string
}

export const conversations: Conversation[] = [
  {
    id: 'v1',
    title: 'Sinc. semanal Aurora',
    tags: ['Aurora', 'SLA', 'entrevistas'],
    snippets: [
      'SLA 48h',
      'shortlist sexta',
      'vaga sênior',
      'board alinhado',
    ],
    excerpt: 'Alinhamos SLAs de resposta e janela para entrevistas com o time de engenharia.',
    participants: ['Ana Ribeiro (Plongê)', 'Marina Duarte (Aurora Labs)'],
    internalUserIds: ['u1'],
    externalContactIds: ['c1'],
    date: '14/04/2025, 10:00',
    channel: 'Google Meet',
    durationPlaceholder: '~32 min (estimado)',
    transcript: `## Participantes
- **Plongê:** Ana Ribeiro
- **Cliente:** Marina Duarte (Aurora Labs)

## Resumo
Marina confirma que o SLA de retorno do hiring manager passa a ser **48 horas úteis** para o estágio de triagem. A shortlist de engenheiro sênior deve sair até **sexta**, com no máximo cinco nomes.

## Trechos
> Ana: "Se o candidato estiver fora do budget, avisamos antes de agendar a rodada técnica?"

> Marina: "Sim, mas só se a divergência for maior que 20%. Abaixo disso vocês seguem com o agendamento."

> Ana: "Combinado. Envio o calendário compartilhado ainda hoje no grupão com engenharia."`,
  },
  {
    id: 'v2',
    title: 'Follow-up Nilo — PM',
    tags: ['Nilo', 'proposta', 'board'],
    snippets: [
      'material vaga',
      'quinta 15h',
      'perfil híbrido',
      'case produto',
    ],
    excerpt: 'Envio de material da vaga e alinhamento de janela com o board na quinta-feira.',
    participants: ['Carlos Mota (Plongê)', 'Ricardo Menezes (Nilo)'],
    internalUserIds: ['u2'],
    externalContactIds: ['c2'],
    date: '13/04/2025, 16:40',
    channel: 'Microsoft Teams',
    durationPlaceholder: '~24 min (estimado)',
    transcript: `## Call de follow-up

Ricardo pediu **one-pager** da vaga de PM com foco em B2B SaaS e experiência com discovery contínuo. Carlos confirma envio do PDF e do **case** usado na última rodada (versão anonimizada).

**Data combinada:** quinta, **15h**, duração de 45 min com o board. Pauta: fit cultural, visão de roadmap e trade-offs de priorização.

> Ricardo: "Queremos alguém que saiba dizer não com dados, não só com opinião."

> Carlos: "Vou puxar duas referências de candidatas que fizeram exatamente isso no portfólio — mando amanhã cedo."`,
  },
  {
    id: 'v3',
    title: 'Kickoff Vértice — data lead',
    tags: ['Vértice', 'ESG', 'perfil'],
    snippets: [
      'dados públicos',
      'squad enxuto',
      'stakeholder CFO',
    ],
    excerpt: 'Primeira conversa de escopo: dados públicos, governança e expectativa do conselho.',
    participants: ['Letícia Nunes (Plongê)', 'Paula Azevedo (Vértice)'],
    internalUserIds: ['u3'],
    externalContactIds: ['c3'],
    date: '12/04/2025, 11:15',
    channel: 'Plia (vídeo)',
    durationPlaceholder: '~41 min (estimado)',
    transcript: `## Contexto
Paula explica que a Vértice precisa de um **lead de dados** com base sólida em modelagem, mas capaz de **traduzir** indicadores de sustentabilidade para o conselho e investidores.

## Próximos passos
- Enviar **mapa de competências** mínimo vs. desejável.
- Validar com CFO se há restrição de localização (híbrido SP x remoto).
- Abrir vaga em modo **confidencial** na primeira semana.

> Paula: "A narrativa importa tanto quanto a precisão estatística — o conselho compra a história com trilha de evidências."

> Letícia: "Vamos trazer candidatos com portfólio de governança de dados, não só BI bonito."`,
  },
  {
    id: 'v4',
    title: 'Check-in interno — funil comercial',
    tags: ['interno', 'pipe', 'forecast'],
    snippets: [
      'forecast Q2',
      '2 neg s/ valor',
      'reunião proposta',
    ],
    excerpt: 'Sincronização interna sobre forecast do trimestre e gargalos no pipe.',
    participants: ['Time comercial Plongê (3 pessoas)'],
    internalUserIds: ['u1', 'u2', 'u4'],
    externalContactIds: [],
    date: '11/04/2025, 09:00',
    channel: 'Slack huddle',
    durationPlaceholder: '~18 min (estimado)',
    transcript: `**Pauta rápida**

1. **Forecast Q2** — três negócios com alta probabilidade, dois sem valor explícito na planilha (marcar owner para atualizar até quarta).
2. **Risco Aurora:** cliente quer antecipar entrega da shortlist; revisar capacidade do squad de sourcing.
3. **Ação:** cada owner atualiza o estágio no CRM até **18h** — Semáforo verde só com valor e próximo passo datado.

Sem decisões novas sobre pricing; retomar na sessão de sexta.`,
  },
  {
    id: 'v5',
    title: 'Beta Analytics — expansão de escopo',
    tags: ['Beta', 'escopo', 'enterprise'],
    snippets: [
      'SOW aditivo',
      'módulo pricing',
      'jurídico cliente',
    ],
    excerpt: 'Negociação de aditivo contratual e módulo de pricing para rollout enterprise.',
    participants: ['Ana Ribeiro (Plongê)', 'André Prado (Beta Analytics)'],
    internalUserIds: ['u1'],
    externalContactIds: ['c4'],
    date: '10/04/2025, 14:30',
    channel: 'Google Meet',
    durationPlaceholder: '~55 min (estimado)',
    transcript: `## Objetivo
Discutir **aditivo** para incluir projeto de **pricing intelligence** acoplado ao rollout enterprise planejado para o segundo semestre.

## Pontos acordados em linha
- Beta envia minuta pelo jurídico até **sexta**.
- Plongê devolve com comentários na segunda; **kickoff** do projeto de talentos paralelo ao piloto de dados de margem.

## Observações
> André: "Precisamos de perfis que conversem com **financeiro e produto** sem medo de planilha pesada."

> Ana: "Vamos montar dupla: um perfil mais quantitativo e outro com histórico de negociação B2B complexa."`,
  },
  {
    id: 'v6',
    title: 'Parceiro — indicação Aurora × Nilo',
    tags: ['parceria', 'indicação', 'co-marketing'],
    snippets: [
      'case conjunto',
      'evento maio',
      'sem exclusividade',
    ],
    excerpt: 'Alinhamento sobre co-marketing leve e indicação cruzada entre contas.',
    participants: ['Carlos Mota (Plongê)', 'Contatos parceiros (2)'],
    internalUserIds: ['u2'],
    externalContactIds: [],
    date: '08/04/2025, 17:00',
    channel: 'WhatsApp Business → Meet',
    durationPlaceholder: '~22 min (estimado)',
    transcript: `Conversa introdutória para **evento em maio** (painel sobre talento em produto).

- Sem exclusividade entre marcas; cada lado leva sua base.
- **Case conjunto** opcional: Aurora + Nilo em formato fireside (30 min).

Follow-up: enviar **mini brief** com datas bloqueadas e sugestão de título do painel até **segunda**.`,
  },
]

/** Conversas agendadas (protótipo) — aparecem em «Próximas conversas». */
export type UpcomingConversationMeta = {
  id: string
  title: string
  scheduledLabel: string
  channel: string
  excerpt: string
}

export const upcomingConversations: UpcomingConversationMeta[] = [
  {
    id: 'uc1',
    title: 'Review trimestral — Aurora',
    scheduledLabel: 'Ter., 6 mai 2026 · 10:00',
    channel: 'Google Meet',
    excerpt: 'Alinhamento de SLA e pipeline de contratação para o trimestre.',
  },
  {
    id: 'uc2',
    title: 'Demo Plia — Nilo',
    scheduledLabel: 'Qua., 7 mai 2026 · 15:30',
    channel: 'Microsoft Teams',
    excerpt: 'Walkthrough do fluxo de sourcing para o board.',
  },
  {
    id: 'uc3',
    title: 'Kickoff expansão — Beta Analytics',
    scheduledLabel: 'Sex., 9 mai 2026 · 09:00',
    channel: 'Google Meet',
    excerpt: 'Primeira sessão após o aditivo contratual.',
  },
]

export function getUpcomingConversationMeta(
  id: string,
): UpcomingConversationMeta | undefined {
  return upcomingConversations.find((u) => u.id === id)
}

export function getConversationById(id: string): Conversation | undefined {
  if (id === 'new') {
    return {
      id: 'new',
      title: 'Nova conversa',
      tags: [],
      snippets: [],
      excerpt: '',
      transcript: '',
      participants: [],
      internalUserIds: [],
      externalContactIds: [],
      date: '',
      channel: '',
      durationPlaceholder: '',
    }
  }
  const up = getUpcomingConversationMeta(id)
  if (up) {
    return {
      id: up.id,
      title: up.title,
      tags: ['Agendada'],
      snippets: [],
      excerpt: up.excerpt,
      transcript: '',
      participants: [],
      internalUserIds: [],
      externalContactIds: [],
      date: up.scheduledLabel,
      channel: up.channel,
      durationPlaceholder: '—',
    }
  }
  return conversations.find((c) => c.id === id)
}

export const companies = [
  { id: 'co1', name: 'Aurora Labs', industry: 'B2B SaaS', size: '120 pessoas' },
  { id: 'co2', name: 'Nilo', industry: 'Fintech', size: '45 pessoas' },
  { id: 'co3', name: 'Vértice', industry: 'Dados / AI', size: '30 pessoas' },
  { id: 'co4', name: 'Beta Analytics', industry: 'Analytics', size: '18 pessoas' },
  { id: 'co5', name: 'Summit Retail', industry: 'Varejo', size: '280 pessoas' },
  { id: 'co6', name: 'Orla Tech', industry: 'Consultoria', size: '65 pessoas' },
  { id: 'co7', name: 'Casa Norte Logística', industry: 'Logística', size: '410 pessoas' },
  { id: 'co8', name: 'Pulse Media Group', industry: 'Mídia', size: '52 pessoas' },
  { id: 'co9', name: 'Atlas GovTech', industry: 'Setor público', size: '95 pessoas' },
  { id: 'co10', name: 'Rio Verde Agro', industry: 'Agronegócio', size: '700 pessoas' },
]

/** Relações empresa ↔ empresa (mock). `matriz_filial`: `from` = matriz, `to` = filial. */
export type CompanyGraphRelation = 'parceiro' | 'matriz_filial' | 'fornecedor'

export type CompanyGraphEdge = {
  from: string
  to: string
  relation: CompanyGraphRelation
}

export const companyGraphEdges: CompanyGraphEdge[] = [
  { from: 'co1', to: 'co2', relation: 'parceiro' },
  { from: 'co2', to: 'co3', relation: 'matriz_filial' },
  { from: 'co1', to: 'co4', relation: 'matriz_filial' },
]

/** IDs estáveis para `?file=` (compartilhável). */
export const DEFAULT_KNOWLEDGE_FILE = 'docs/playbook'

/** Id padrão ao abrir `/kb` sem `:docId` (alias do playbook). */
export const DEFAULT_KB_DOC_ID = DEFAULT_KNOWLEDGE_FILE

/** Rotas antigas `?file=` → id em `/kb/:docId` (mapeamentos legados; vazio = ids já canônicos). */
export const legacyKnowledgeFileToKbId: Record<string, string> = {}

export type KnowledgeDocEntry = {
  title: string
  body: string
  /** Palavras extras para busca (além de título, caminho e corpo). */
  keywords?: string[]
  /** Documento pai na wiki (opcional). */
  parentId?: string
  /** Documentos relacionados (opcional). */
  relatedIds?: string[]
}

export const knowledgeDocuments: Record<string, KnowledgeDocEntry> = {
  [DEFAULT_KNOWLEDGE_FILE]: {
    title: 'Playbook: entrevista técnica',
    keywords: ['roteiro', 'entrevista', 'distribuído', 'engenharia'],
    body: `## Objetivo
Avaliar profundidade em sistema distribuído e clareza de trade-offs.

## Roteiro (45 min)
1. Contexto do candidato (5 min)
2. Estudo de caso — fila e idempotência (20 min)
3. Perguntas abertas sobre observabilidade (10 min)
4. Espaço para perguntas (10 min)

## Hashtags
#engenharia #processo #cliente-aurora`,
  },
  'docs/readme': {
    title: 'docs/readme',
    keywords: ['índice', 'contribuir', 'markdown'],
    body: `## Visão geral
Índice do repositório de conhecimento interno.

## Como contribuir
1. Abra um PR com o \`.md\` na pasta correta.
2. Use links relativos entre páginas.
3. Marque revisores do capítulo.`,
  },
  'guia/inicio': {
    title: 'Guia — Primeiros passos',
    keywords: ['onboarding', 'sidebar', 'protótipo'],
    body: `## Onboarding
- Acesse **Conhecimento** pelo ícone da barra lateral.
- Use a busca à esquerda para filtrar páginas e compartilhe o link (URL com \`?file=\`).

## Atalhos
Nenhum ainda — este é um protótipo.`,
  },
  'guia/referencia/api': {
    title: 'Referência — API interna',
    keywords: ['rest', 'endpoint', 'autenticação'],
    body: `## Endpoints (mock)
| Método | Path | Uso |
|--------|------|-----|
| GET | /v1/docs | Listar metadados |
| GET | /v1/docs/:id | Obter corpo |

## Notas
Autenticação e rate limit serão documentados na versão final.`,
  },
}

export type KnowledgeTreeNode =
  | {
      kind: 'folder'
      id: string
      label: string
      children: KnowledgeTreeNode[]
    }
  | { kind: 'file'; id: string; label: string }

/** Árvore mock — pastas e arquivos .md. */
export const knowledgeFolderTree: KnowledgeTreeNode[] = [
  {
    kind: 'folder',
    id: 'folder:docs',
    label: 'docs',
    children: [
      { kind: 'file', id: 'docs/readme', label: 'readme.md' },
      { kind: 'file', id: DEFAULT_KNOWLEDGE_FILE, label: 'playbook.md' },
    ],
  },
  {
    kind: 'folder',
    id: 'folder:guia',
    label: 'guia',
    children: [
      { kind: 'file', id: 'guia/inicio', label: 'inicio.md' },
      {
        kind: 'folder',
        id: 'folder:guia/referencia',
        label: 'referencia',
        children: [{ kind: 'file', id: 'guia/referencia/api', label: 'api.md' }],
      },
    ],
  },
]

/** Caminho legível para lista / busca (ex.: `guia › referencia › api`). */
export function knowledgePathBreadcrumb(fileId: string): string {
  return fileId.split('/').join(' › ')
}

/** @deprecated use knowledgeDocuments[DEFAULT_KNOWLEDGE_FILE] */
export const knowledgePage = {
  title: knowledgeDocuments[DEFAULT_KNOWLEDGE_FILE].title,
  body: knowledgeDocuments[DEFAULT_KNOWLEDGE_FILE].body,
}
