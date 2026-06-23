/** Rascunho do novo documento (protótipo). */
export const KNOWLEDGE_DRAFT_KEY = 'plonge:knowledge:draft'

/** Rascunho por página existente `/kb/:docId`. */
export const KNOWLEDGE_DOC_DRAFT_PREFIX = 'plonge:knowledge:doc:'

export type KnowledgeDraft = {
  title: string
  body: string
}

const empty: KnowledgeDraft = { title: '', body: '' }

export function knowledgeDocStorageKey(docId: string): string {
  return `${KNOWLEDGE_DOC_DRAFT_PREFIX}${docId}`
}

export function loadKnowledgeDraft(): KnowledgeDraft {
  if (typeof window === 'undefined') return { ...empty }
  try {
    const raw = localStorage.getItem(KNOWLEDGE_DRAFT_KEY)
    if (!raw) return { ...empty }
    const parsed = JSON.parse(raw) as Partial<KnowledgeDraft>
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      body: typeof parsed.body === 'string' ? parsed.body : '',
    }
  } catch {
    return { ...empty }
  }
}

export function saveKnowledgeDraft(draft: KnowledgeDraft): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KNOWLEDGE_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* ignore */
  }
}

export function loadKnowledgeDocDraft(docId: string): KnowledgeDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(knowledgeDocStorageKey(docId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<KnowledgeDraft>
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      body: typeof parsed.body === 'string' ? parsed.body : '',
    }
  } catch {
    return null
  }
}

export function saveKnowledgeDocDraft(docId: string, draft: KnowledgeDraft): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(knowledgeDocStorageKey(docId), JSON.stringify(draft))
  } catch {
    /* ignore */
  }
}

/** Corpo preenchido sem título — inválido para publicar (protótipo). */
export function validateKnowledgeDraft(d: KnowledgeDraft): boolean {
  const t = d.title.trim()
  const b = d.body.trim()
  if (b.length > 0 && t.length === 0) return false
  return true
}
