import {
  companies,
  contacts,
  deals,
  getConversationById,
  getRunningProjectById,
} from '../data/mock'
import { parseDetailKey } from './detailShare'

const STORAGE_KEY = 'plonge:company-recent-access'

type AccessStore = Record<string, { lastAt: number; lastSource: string }>

/** Ordem inicial quando não há histórico — simula menções recentes nos módulos. */
const SEED_ENTRIES: { companyId: string; lastSource: string; ageHours: number }[] = [
  { companyId: 'co1', lastSource: 'Negócio · Aurora — Eng. Sênior', ageHours: 2 },
  { companyId: 'co2', lastSource: 'Projeto · Product — PM', ageHours: 5 },
  { companyId: 'co3', lastSource: 'Conversa · Kickoff Vértice', ageHours: 8 },
  { companyId: 'co4', lastSource: 'Contato · André Prado', ageHours: 12 },
  { companyId: 'co5', lastSource: 'Base · cliente potencial', ageHours: 24 },
  { companyId: 'co6', lastSource: 'Pipeline · prospecção', ageHours: 36 },
  { companyId: 'co7', lastSource: 'Wiki · caso citado', ageHours: 48 },
  { companyId: 'co8', lastSource: 'Conversa futura · uc3', ageHours: 60 },
  { companyId: 'co9', lastSource: 'Integração CRM (mock)', ageHours: 72 },
  { companyId: 'co10', lastSource: 'Relatório trimestral', ageHours: 96 },
]

function loadStore(): AccessStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw) as AccessStore
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

function saveStore(store: AccessStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event('plonge:company-recent'))
  } catch {
    /* ignore */
  }
}

function ensureSeed(store: AccessStore): AccessStore {
  if (Object.keys(store).length > 0) return store
  const now = Date.now()
  const next: AccessStore = {}
  for (const row of SEED_ENTRIES) {
    next[row.companyId] = {
      lastAt: now - row.ageHours * 60 * 60 * 1000,
      lastSource: row.lastSource,
    }
  }
  saveStore(next)
  return next
}

/** Regista que o utilizador cruzou uma empresa noutro módulo (painel ou rota). */
export function recordCompanyAccess(companyId: string, source: string): void {
  if (!companyId || !companies.some((c) => c.id === companyId) || !source.trim()) return
  const store = loadStore()
  store[companyId] = { lastAt: Date.now(), lastSource: source.trim() }
  saveStore(store)
}

export type RecentCompanyRow = {
  companyId: string
  lastAt: number
  lastSource: string
}

/** Empresas únicas ordenadas por último acesso (mais recente primeiro). */
export function getRecentCompaniesWithMeta(limit: number): RecentCompanyRow[] {
  let store = loadStore()
  store = ensureSeed(store)
  return Object.entries(store)
    .filter(([companyId]) => companies.some((c) => c.id === companyId))
    .map(([companyId, v]) => ({
      companyId,
      lastAt: v.lastAt,
      lastSource: v.lastSource,
    }))
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, limit)
}

/** Infere empresas a partir do painel de detalhe e da rota atual. */
export function recordCompanyAccessFromNavigation(
  pathname: string,
  detailKey: string | null,
): void {
  const record = (companyId: string | undefined, source: string) => {
    if (!companyId) return
    recordCompanyAccess(companyId, source)
  }

  if (detailKey) {
    const p = parseDetailKey(detailKey)
    if (p) {
      if (p.kind === 'company') {
        record(p.id, 'Painel · empresa')
        return
      }
      if (p.kind === 'contact') {
        const c = contacts.find((x) => x.id === p.id)
        record(c?.companyId, 'Painel · contato')
        return
      }
      if (p.kind === 'deal') {
        const d = deals.find((x) => x.id === p.id)
        record(d?.companyId, 'Painel · negócio')
        return
      }
      if (p.kind === 'project') {
        const pr = getRunningProjectById(p.id)
        record(pr?.clientCompanyId, 'Painel · projeto')
        return
      }
      if (p.kind === 'conversation') {
        const conv = getConversationById(p.id)
        if (!conv) return
        const seen = new Set<string>()
        for (const cid of conv.externalContactIds ?? []) {
          const ct = contacts.find((x) => x.id === cid)
          if (ct?.companyId && !seen.has(ct.companyId)) {
            seen.add(ct.companyId)
            record(ct.companyId, 'Painel · conversa')
          }
        }
        return
      }
    }
  }

  const contactMatch = pathname.match(/^\/contact\/([^/]+)$/u)
  if (contactMatch) {
    const c = contacts.find((x) => x.id === contactMatch[1])
    record(c?.companyId, 'Contato · perfil')
  }
}
