import { deals, type Deal } from '../data/mock'

const PREFIX = 'plonge:deal-session:'

export function loadDealSessionOverrides(dealId: string): Partial<Deal> {
  if (!dealId || dealId === 'new') return {}
  try {
    const raw = localStorage.getItem(`${PREFIX}${dealId}`)
    if (!raw) return {}
    const p = JSON.parse(raw) as Partial<Deal>
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

export function saveDealSessionOverrides(dealId: string, patch: Partial<Deal>): void {
  if (!dealId || dealId === 'new') return
  try {
    const prev = loadDealSessionOverrides(dealId)
    const next = { ...prev, ...patch }
    localStorage.setItem(`${PREFIX}${dealId}`, JSON.stringify(next))
    window.dispatchEvent(
      new CustomEvent('plonge:deal-session', { detail: { dealId } }),
    )
  } catch {
    /* ignore */
  }
}

/** Negócio mock + alterações guardadas no painel / detalhe. */
export function getDealWithSessionOverrides(dealId: string): Deal | undefined {
  const base = deals.find((d) => d.id === dealId)
  if (!base) return undefined
  const ov = loadDealSessionOverrides(dealId)
  return { ...base, ...ov }
}
