import { useCallback, useEffect, useRef, useState } from 'react'
import type { Conversation } from '../data/mock'
import {
  loadConversationSession,
  saveConversationSession,
} from '../lib/conversationSessionStorage'

function initialBody(c: Conversation): string {
  return loadConversationSession(c.id).transcript
}

export type ConversationTranscriptEditorProps = {
  conversation: Conversation
  /** `canvas`: só o texto na superfície (detalhe aberto); `default`: bloco com título auxiliar. */
  variant?: 'default' | 'canvas'
}

/** Transcrição editável na superfície Plia — estado partilhado com o painel de metadados (sessão). */
export function ConversationTranscriptEditor({
  conversation,
  variant = 'default',
}: ConversationTranscriptEditorProps) {
  const [value, setValue] = useState(() => initialBody(conversation))
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(initialBody(conversation))
  }, [conversation])

  const scheduleSave = useCallback(
    (text: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveConversationSession(conversation.id, { transcript: text })
      }, 320)
    },
    [conversation.id],
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const textareaClass =
    variant === 'canvas'
      ? 'min-h-[min(70vh,42rem)] w-full flex-1 resize-y rounded-xl border border-zinc-700/40 bg-zinc-950/30 px-4 py-3 font-serif text-[15px] leading-relaxed text-zinc-100 shadow-inner outline-none ring-coral-500/30 placeholder:text-zinc-600 focus:border-coral-500/45 focus:ring-2 focus:ring-coral-500/20'
      : 'min-h-[18rem] w-full resize-y rounded-xl border border-[var(--color-plonge-border)] bg-zinc-950/40 px-4 py-3 font-serif text-[15px] leading-relaxed text-zinc-100 shadow-inner outline-none ring-coral-500/30 placeholder:text-zinc-600 focus:border-coral-500/50 focus:ring-2'

  return (
    <section
      className={variant === 'canvas' ? 'flex min-h-0 flex-1 flex-col gap-3' : 'space-y-3'}
    >
      {variant === 'default' ? (
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">
            Transcrição (Plia)
          </h2>
          <p className="text-[11px] text-zinc-500">
            Rascunho sincronizado em{' '}
            <code className="rounded bg-zinc-800/80 px-1 py-0.5 text-coral-300/90">
              plonge:conversation-session:{conversation.id}
            </code>
          </p>
        </div>
      ) : (
        <p className="sr-only">
          Rascunho sincronizado com os metadados da conversa no painel à direita.
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => {
          const next = e.target.value
          setValue(next)
          scheduleSave(next)
        }}
        spellCheck
        className={textareaClass}
        aria-label="Transcrição da conversa"
      />
    </section>
  )
}
