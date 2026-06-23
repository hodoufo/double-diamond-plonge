const PREFIX = 'plonge:company-people:'

export type CompanyStakeholderRole =
  | 'decisor'
  | 'sponsor'
  | 'operacional'
  | 'influenciador'
  | 'outro'

export const COMPANY_STAKEHOLDER_ROLE_LABEL: Record<CompanyStakeholderRole, string> = {
  decisor: 'Decisor',
  sponsor: 'Sponsor / padrinho de conta',
  operacional: 'Operacional (dia a dia)',
  influenciador: 'Influenciador',
  outro: 'Outro',
}

export type CompanyPeopleRowPersisted = {
  key: string
  companyRole: CompanyStakeholderRole
  jobTitle: string
  mode: 'existing' | 'new'
  contactId: string | null
  contactSearch: string
  newName: string
  newEmail: string
  newPhone: string
  newRole: string
  newLinkedIn: string
}

function storageKey(companyId: string) {
  return `${PREFIX}${companyId}`
}

export function loadCompanyPeopleRows(companyId: string): CompanyPeopleRowPersisted[] | null {
  try {
    const raw = localStorage.getItem(storageKey(companyId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const rows = (parsed as { rows?: unknown }).rows
    if (!Array.isArray(rows)) return null
    return rows.filter((r): r is CompanyPeopleRowPersisted => {
      return (
        r &&
        typeof r === 'object' &&
        typeof (r as CompanyPeopleRowPersisted).key === 'string'
      )
    })
  } catch {
    return null
  }
}

export function saveCompanyPeopleRows(
  companyId: string,
  rows: CompanyPeopleRowPersisted[],
): void {
  try {
    localStorage.setItem(storageKey(companyId), JSON.stringify({ rows }))
    window.dispatchEvent(new CustomEvent('plonge:company-people', { detail: { companyId } }))
  } catch {
    /* ignore */
  }
}
