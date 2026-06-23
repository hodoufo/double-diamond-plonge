const PREFIX = 'plonge:conversation-edit:'

export function conversationEditStorageKey(conversationId: string): string {
  return `${PREFIX}${conversationId}`
}

export function loadConversationDraft(conversationId: string): string | null {
  try {
    return localStorage.getItem(conversationEditStorageKey(conversationId))
  } catch {
    return null
  }
}

export function saveConversationDraft(conversationId: string, body: string): void {
  try {
    localStorage.setItem(conversationEditStorageKey(conversationId), body)
  } catch {
    /* quota ou modo privado */
  }
}
