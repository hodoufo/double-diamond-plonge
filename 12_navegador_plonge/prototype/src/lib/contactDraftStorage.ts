/** Rascunhos offline (protótipo) — sincronização real viria depois. */
export const CONTACT_DRAFTS_KEY = 'plonge:contacts:drafts'

export type ContactDraftFields = {
  name: string
  email: string
  phone: string
  /** Cabeçalho do currículo na superfície Plia */
  role: string
  company: string
  /** Eixos comerciais — guardados como string livre, validação por listas em `data/mock`. */
  estrategia: string
  origem: string
  status: string
  /** Secções em texto livre (currículo editável na superfície) */
  cvResumo: string
  cvExperiencia: string
  cvFormacao: string
  cvCompetencias: string
}

export type ContactDraftsFile = {
  new: ContactDraftFields
}

const emptyDraft: ContactDraftFields = {
  name: '',
  email: '',
  phone: '',
  role: '',
  company: '',
  estrategia: '',
  origem: '',
  status: '',
  cvResumo: '',
  cvExperiencia: '',
  cvFormacao: '',
  cvCompetencias: '',
}

export function loadContactDraftNew(): ContactDraftFields {
  if (typeof window === 'undefined') return { ...emptyDraft }
  try {
    const raw = localStorage.getItem(CONTACT_DRAFTS_KEY)
    if (!raw) return { ...emptyDraft }
    const parsed = JSON.parse(raw) as Partial<ContactDraftsFile>
    const d = parsed?.new
    if (!d || typeof d !== 'object') return { ...emptyDraft }
    return {
      name: typeof d.name === 'string' ? d.name : '',
      email: typeof d.email === 'string' ? d.email : '',
      phone: typeof d.phone === 'string' ? d.phone : '',
      role: typeof d.role === 'string' ? d.role : '',
      company: typeof d.company === 'string' ? d.company : '',
      estrategia: typeof d.estrategia === 'string' ? d.estrategia : '',
      origem: typeof d.origem === 'string' ? d.origem : '',
      status: typeof d.status === 'string' ? d.status : '',
      cvResumo: typeof d.cvResumo === 'string' ? d.cvResumo : '',
      cvExperiencia: typeof d.cvExperiencia === 'string' ? d.cvExperiencia : '',
      cvFormacao: typeof d.cvFormacao === 'string' ? d.cvFormacao : '',
      cvCompetencias: typeof d.cvCompetencias === 'string' ? d.cvCompetencias : '',
    }
  } catch {
    return { ...emptyDraft }
  }
}

export function saveContactDraftNew(fields: ContactDraftFields): void {
  if (typeof window === 'undefined') return
  try {
    const next: ContactDraftsFile = { new: { ...fields } }
    localStorage.setItem(CONTACT_DRAFTS_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota / private mode */
  }
}
