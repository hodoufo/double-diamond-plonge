import type { Conversation } from '../data/mock'

export type PhraseCloudItem = {
  key: string
  text: string
  conversationId: string
  /** Título da conversa (acessibilidade) */
  conversationTitle: string
  kind: 'snippet' | 'title'
}

function buildItems(conversations: Conversation[]): PhraseCloudItem[] {
  const out: PhraseCloudItem[] = []
  for (const c of conversations) {
    out.push({
      key: `${c.id}:title`,
      text: c.title,
      conversationId: c.id,
      conversationTitle: c.title,
      kind: 'title',
    })
    for (let i = 0; i < c.snippets.length; i++) {
      out.push({
        key: `${c.id}:s${i}`,
        text: c.snippets[i]!,
        conversationId: c.id,
        conversationTitle: c.title,
        kind: 'snippet',
      })
    }
  }
  return out
}

const VARIATION = [
  'text-[11px] sm:text-xs opacity-[0.55] -rotate-2 shadow-sm',
  'text-xs opacity-70 rotate-1',
  'text-xs opacity-80 -rotate-1',
  'text-sm opacity-85 rotate-2',
  'text-sm opacity-90 -rotate-[3deg]',
  'text-[13px] sm:text-sm opacity-95 rotate-1',
  'text-xs opacity-65 rotate-[2.5deg]',
] as const

export type ConversationPhraseCloudProps = {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (conversationId: string) => void
}

/** Nuvem de frases — variação visual só com CSS (nth-child + classes). */
export function ConversationPhraseCloud({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationPhraseCloudProps) {
  const items = buildItems(conversations)

  return (
    <div
      className="rounded-2xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/90 px-3 py-6 sm:px-6"
      role="list"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4">
        {items.map((item, index) => {
          const v = VARIATION[index % VARIATION.length]
          const isTitle = item.kind === 'title'
          const selected = selectedConversationId === item.conversationId
          return (
            <button
              key={item.key}
              type="button"
              role="listitem"
              onClick={() => onSelectConversation(item.conversationId)}
              title={`Abrir: ${item.conversationTitle}`}
              className={[
                'max-w-[min(100%,14rem)] rounded-full border px-3 py-1.5 text-left font-medium tracking-tight transition-colors',
                v,
                isTitle
                  ? 'border-coral-500/35 bg-coral-950/30 text-coral-100'
                  : 'border-zinc-600/60 bg-zinc-900/80 text-zinc-200 hover:border-coral-500/40 hover:bg-zinc-800/90',
                selected
                  ? 'ring-2 ring-coral-400/50 ring-offset-2 ring-offset-[var(--color-plonge-card)]'
                  : '',
              ].join(' ')}
            >
              <span className="line-clamp-2">{item.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
