import {
  candidates,
  commercialPipeStages,
  companies,
  contacts,
  conversations,
  deals,
  getUpcomingConversationMeta,
  knowledgePage,
  projectPipeline,
  getRunningProjectById,
  upcomingTasks,
} from '../data/mock'

export function parseDetailKey(key: string): { kind: string; id: string } | null {
  const i = key.indexOf(':')
  if (i <= 0) return null
  const kind = key.slice(0, i)
  const id = key.slice(i + 1)
  if (!kind || !id) return null
  return { kind, id }
}

/** Segmento após `/projects/` (ex.: `p1`), ou `null` para `/projects` ou outras rotas. */
export function parseProjectIdFromProjectsPath(pathname: string): string | null {
  if (!pathname.startsWith('/projects/')) return null
  const rest = pathname.slice('/projects/'.length)
  const segment = rest.split('/')[0]
  if (!segment) return null
  return segment
}

/** Segmento após `/deals/` (ex.: `d1` ou `new`). */
export function parseDealIdFromDealsPath(pathname: string): string | null {
  if (!pathname.startsWith('/deals/')) return null
  const rest = pathname.slice('/deals/'.length)
  const segment = rest.split('/')[0]
  if (!segment) return null
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function validPathDealId(pathname: string): string | null {
  const id = parseDealIdFromDealsPath(pathname)
  if (!id) return null
  if (id === 'new') return id
  return deals.some((d) => d.id === id) ? id : null
}

/** Segmento após `/conversations/` (ex.: `v1` ou `new`). */
export function parseConversationIdFromPath(pathname: string): string | null {
  if (!pathname.startsWith('/conversations/')) return null
  const rest = pathname.slice('/conversations/'.length)
  const segment = rest.split('/')[0]
  if (!segment) return null
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function validPathConversationId(pathname: string): string | null {
  const id = parseConversationIdFromPath(pathname)
  if (!id) return null
  if (id === 'new') return id
  if (conversations.some((c) => c.id === id)) return id
  if (getUpcomingConversationMeta(id)) return id
  return null
}

/**
 * Painel: path `/projects/:id` define o projeto quando não há outro detalhe na query
 * (ex.: `?detail=task:…` continua tendo prioridade sobre o projeto do path).
 */
export function resolveEffectiveDetailKey(
  pathname: string,
  searchDetail: string | null,
): string | null {
  const pathProjectId = parseProjectIdFromProjectsPath(pathname)
  const validPathProjectId =
    pathProjectId && getRunningProjectById(pathProjectId) ? pathProjectId : null

  const pathDealId = validPathDealId(pathname)
  const pathConversationId = validPathConversationId(pathname)

  if (searchDetail) {
    const parsed = parseDetailKey(searchDetail)
    if (
      parsed &&
      parsed.kind !== 'project' &&
      parsed.kind !== 'deal' &&
      parsed.kind !== 'conversation'
    ) {
      return searchDetail
    }
  }

  if (validPathProjectId) {
    return `project:${validPathProjectId}`
  }

  if (pathDealId) {
    return `deal:${pathDealId}`
  }

  if (pathConversationId) {
    return `conversation:${pathConversationId}`
  }

  return searchDetail
}

/** Remove prefixos tipo "01 ", "02." do rótulo da etapa (igual ao funil). */
export function stripLeadingStageIndex(title: string): string {
  return title.replace(/^\s*\d{1,2}(?:[.)]\s*|\s+)/u, '').trimStart()
}

/** Título exibido no header do painel (registro ou fallback de rota). */
export function getDetailPanelTitle(
  detailKey: string | null,
  pathname: string,
): string {
  if (detailKey) {
    const p = parseDetailKey(detailKey)
    if (!p) return 'Detalhe'

    switch (p.kind) {
      case 'task': {
        const t = upcomingTasks.find((x) => x.id === p.id)
        return t?.title ?? 'Tarefa'
      }
      case 'project': {
        const pr = getRunningProjectById(p.id)
        return pr?.name ?? 'Projeto'
      }
      case 'stage': {
        const s = commercialPipeStages.find((x) => x.id === p.id)
        return s
          ? stripLeadingStageIndex(s.title)
          : 'Etapa do pipe'
      }
      case 'contact': {
        if (p.id === 'new') return 'Novo contato'
        const c = contacts.find((x) => x.id === p.id)
        return c?.name ?? 'Contato'
      }
      case 'deal': {
        if (p.id === 'new') return 'Novo negócio'
        const d = deals.find((x) => x.id === p.id)
        return d?.name ?? 'Negócio'
      }
      case 'candidate': {
        const a = candidates.find((x) => x.id === p.id)
        return a?.name ?? 'Candidato'
      }
      case 'pipeline': {
        const s = projectPipeline.find((x) => x.id === p.id)
        return s?.name ?? 'Etapa ATS'
      }
      case 'conversation': {
        if (p.id === 'new') return 'Nova conversa'
        const soon = getUpcomingConversationMeta(p.id)
        if (soon) return soon.title
        const v = conversations.find((x) => x.id === p.id)
        return v?.title ?? 'Conversa'
      }
      case 'company': {
        const co = companies.find((x) => x.id === p.id)
        return co?.name ?? 'Empresa'
      }
      case 'knowledge':
        return knowledgePage.title
      case 'plia':
        return 'Plia'
      default:
        return 'Detalhe'
    }
  }

  if (pathname === '/' || pathname.startsWith('/home')) return 'Home'
  if (pathname === '/contacts/new') return 'Novo contato'
  if (
    pathname.startsWith('/contacts') ||
    /^\/contact\/[^/]+$/u.test(pathname)
  ) {
    return 'Contatos'
  }
  if (pathname.startsWith('/deals')) {
    const dealPathId = validPathDealId(pathname)
    if (dealPathId === 'new') return 'Novo negócio'
    if (dealPathId) {
      const d = deals.find((x) => x.id === dealPathId)
      return d?.name ?? 'Negócio'
    }
    return 'Negócios'
  }
  if (pathname.startsWith('/projects')) return 'Projetos'
  if (pathname === '/kb' || pathname.startsWith('/kb/')) return 'Conhecimento'
  if (pathname.startsWith('/conversations')) {
    const convPathId = validPathConversationId(pathname)
    if (convPathId === 'new') return 'Nova conversa'
    if (convPathId) {
      const soon = getUpcomingConversationMeta(convPathId)
      if (soon) return soon.title
      const v = conversations.find((x) => x.id === convPathId)
      return v?.title ?? 'Conversa'
    }
    return 'Conversas'
  }
  if (pathname.startsWith('/companies')) return 'Empresas'
  return 'Detalhe'
}
