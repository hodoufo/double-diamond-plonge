import type { Conversation } from '../data/mock'
import { getConversationById } from '../data/mock'
import { loadConversationDraft } from './conversationEditStorage'

const PREFIX = 'plonge:conversation-session:'

export type QuickContactDraft = {
  tempId: string
  name: string
  email: string
  companyId: string
}

export type ConversationSessionState = {
  title: string
  transcript: string
  internalUserIds: string[]
  externalContactIds: string[]
  quickContacts: QuickContactDraft[]
  date: string
  channel: string
  durationPlaceholder: string
}

function storageKey(conversationId: string) {
  return `${PREFIX}${conversationId}`
}

function emit() {
  window.dispatchEvent(new Event('plonge:conversation-session'))
}

function baseFromConversation(c: Conversation): ConversationSessionState {
  const transcript =
    loadConversationDraft(c.id) ?? c.transcript
  return {
    title: c.title,
    transcript,
    internalUserIds: [...c.internalUserIds],
    externalContactIds: [...c.externalContactIds],
    quickContacts: [],
    date: c.date,
    channel: c.channel,
    durationPlaceholder: c.durationPlaceholder,
  }
}

export function loadConversationSession(conversationId: string): ConversationSessionState {
  const baseConv = getConversationById(conversationId)
  if (!baseConv) {
    return {
      title: '',
      transcript: '',
      internalUserIds: [],
      externalContactIds: [],
      quickContacts: [],
      date: '',
      channel: '',
      durationPlaceholder: '',
    }
  }

  try {
    const raw = localStorage.getItem(storageKey(conversationId))
    if (!raw) return baseFromConversation(baseConv)
    const parsed = JSON.parse(raw) as Partial<ConversationSessionState>
    const base = baseFromConversation(baseConv)
    return {
      title: typeof parsed.title === 'string' ? parsed.title : base.title,
      transcript: typeof parsed.transcript === 'string' ? parsed.transcript : base.transcript,
      internalUserIds: Array.isArray(parsed.internalUserIds)
        ? parsed.internalUserIds.filter((x): x is string => typeof x === 'string')
        : base.internalUserIds,
      externalContactIds: Array.isArray(parsed.externalContactIds)
        ? parsed.externalContactIds.filter((x): x is string => typeof x === 'string')
        : base.externalContactIds,
      quickContacts: Array.isArray(parsed.quickContacts)
        ? parsed.quickContacts.filter(
            (x): x is QuickContactDraft =>
              x &&
              typeof x === 'object' &&
              typeof (x as QuickContactDraft).tempId === 'string',
          )
        : [],
      date: typeof parsed.date === 'string' ? parsed.date : base.date,
      channel: typeof parsed.channel === 'string' ? parsed.channel : base.channel,
      durationPlaceholder:
        typeof parsed.durationPlaceholder === 'string'
          ? parsed.durationPlaceholder
          : base.durationPlaceholder,
    }
  } catch {
    return baseFromConversation(baseConv)
  }
}

export function saveConversationSession(
  conversationId: string,
  patch: Partial<ConversationSessionState>,
): void {
  const prev = loadConversationSession(conversationId)
  const next: ConversationSessionState = { ...prev, ...patch }
  try {
    localStorage.setItem(storageKey(conversationId), JSON.stringify(next))
    emit()
  } catch {
    /* ignore */
  }
}

export function subscribeConversationSession(listener: () => void): () => void {
  window.addEventListener('plonge:conversation-session', listener)
  return () => window.removeEventListener('plonge:conversation-session', listener)
}
