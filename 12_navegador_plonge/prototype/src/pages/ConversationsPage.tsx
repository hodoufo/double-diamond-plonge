import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { FutureConversationModal } from '../components/FutureConversationModal'
import { ConversationTranscriptEditor } from '../components/ConversationTranscriptEditor'
import { useDetailPanel } from '../context/useDetailPanel'
import {
  conversations,
  getConversationById,
  upcomingConversations,
} from '../data/mock'
import { parseDetailKey } from '../lib/detailShare'

function isValidConversationSegment(id: string): boolean {
  if (id === 'new') return true
  if (conversations.some((c) => c.id === id)) return true
  if (upcomingConversations.some((u) => u.id === id)) return true
  return false
}

export function ConversationsPage() {
  const { conversationId: segment } = useParams<{ conversationId?: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { detailKey, openDetailPanel } = useDetailPanel()
  const [futureConversationOpen, setFutureConversationOpen] = useState(false)

  /** Migra `?detail=conversation:…` para o path canónico `/conversations/:id`. */
  useEffect(() => {
    const detail = searchParams.get('detail')
    if (!detail) return
    const p = parseDetailKey(detail)
    if (p?.kind !== 'conversation' || !p.id) return
    const next = new URLSearchParams(searchParams)
    next.delete('detail')
    const q = next.toString()
    navigate(
      {
        pathname: `/conversations/${p.id}`,
        search: q ? `?${q}` : '',
      },
      { replace: true },
    )
  }, [navigate, searchParams])

  const routeInvalid =
    segment !== undefined && segment !== '' && !isValidConversationSegment(segment)

  const selectedConversation = useMemo(() => {
    if (segment && isValidConversationSegment(segment)) {
      return getConversationById(segment) ?? null
    }
    if (!detailKey) return null
    const p = parseDetailKey(detailKey)
    if (!p || p.kind !== 'conversation') return null
    return getConversationById(p.id) ?? null
  }, [detailKey, segment])

  const selectedId = selectedConversation?.id ?? null

  /** Rota `/conversations/:id` — corpo na Plia, metadados no painel (via `resolveEffectiveDetailKey`). */
  const isConversationDetailRoute =
    Boolean(segment && segment !== '' && isValidConversationSegment(segment))

  /** Garante painel aberto com os metadados ao focar uma conversa pela lista. */
  useEffect(() => {
    if (!isConversationDetailRoute || !segment) return
    openDetailPanel()
  }, [isConversationDetailRoute, segment, openDetailPanel])

  if (routeInvalid) {
    return <Navigate to="/conversations" replace />
  }

  return (
    <div
      className={
        isConversationDetailRoute
          ? 'flex min-h-0 flex-1 flex-col'
          : 'space-y-8'
      }
    >
      {!isConversationDetailRoute && (
        <>
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
                Conversas
              </h1>
              <p className="text-sm text-[var(--color-plonge-muted)]">
                Próximas na agenda e últimas registadas — transcrição na Plia e metadados à direita.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 shadow-sm hover:bg-zinc-800"
              >
                Filtros
              </button>
              <button
                type="button"
                onClick={() => navigate('/conversations/new')}
                className="rounded-lg border border-coral-600/50 bg-coral-950/40 px-3 py-2 text-sm font-medium text-coral-100 shadow-sm hover:bg-coral-950/60"
              >
                Nova conversa
              </button>
              <button
                type="button"
                onClick={() => setFutureConversationOpen(true)}
                className="rounded-lg bg-coral-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600"
              >
                + Conversa futura
              </button>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">
                Próximas conversas
              </h2>
              <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
                {upcomingConversations.map((u) => {
                  const selected = selectedId === u.id
                  return (
                    <li key={u.id} className="first:rounded-t-xl last:rounded-b-xl">
                      <button
                        type="button"
                        onClick={() => navigate(`/conversations/${u.id}`)}
                        className={[
                          'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                          selected
                            ? 'bg-coral-950/25 ring-1 ring-inset ring-coral-500/35'
                            : 'hover:bg-zinc-800/40',
                        ].join(' ')}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-teal-500/35 bg-teal-950/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-200">
                              Agendada
                            </span>
                            <span className="truncate text-sm font-medium leading-snug text-[var(--color-plonge-ink)]">
                              {u.title}
                            </span>
                          </div>
                          <p className="mt-1 text-xs tabular-nums text-zinc-500">
                            {u.scheduledLabel} · {u.channel}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-snug text-zinc-400">
                            {u.excerpt}
                          </p>
                        </div>
                        <ChevronRight
                          className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600"
                          aria-hidden
                          strokeWidth={2}
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">
                Últimas conversas
              </h2>
              <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
                {conversations.map((c) => {
                  const selected = selectedId === c.id
                  return (
                    <li key={c.id} className="first:rounded-t-xl last:rounded-b-xl">
                      <button
                        type="button"
                        onClick={() => navigate(`/conversations/${c.id}`)}
                        className={[
                          'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                          selected
                            ? 'bg-coral-950/25 ring-1 ring-inset ring-coral-500/35'
                            : 'hover:bg-zinc-800/40',
                        ].join(' ')}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium leading-snug text-[var(--color-plonge-ink)]">
                            {c.title}
                          </p>
                          <p className="mt-1 text-xs tabular-nums text-zinc-500">
                            {c.date} · {c.channel}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-snug text-zinc-400">
                            {c.excerpt}
                          </p>
                        </div>
                        <ChevronRight
                          className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600"
                          aria-hidden
                          strokeWidth={2}
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>
        </>
      )}

      {isConversationDetailRoute && selectedConversation ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/conversations')}
              className="text-sm font-medium text-coral-400/95 underline-offset-2 hover:text-coral-300 hover:underline"
            >
              ← Todas as conversas
            </button>
            <span className="min-w-0 truncate text-base font-semibold tracking-tight text-[var(--color-plonge-ink)]">
              {selectedConversation.title}
            </span>
          </div>
          <ConversationTranscriptEditor
            key={selectedConversation.id}
            conversation={selectedConversation}
            variant="canvas"
          />
        </div>
      ) : null}

      {!isConversationDetailRoute && !selectedConversation ? (
        <section className="rounded-xl border border-dashed border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--color-plonge-ink)]">
            Nenhuma conversa selecionada
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Escolha um item nas listas acima, use{' '}
            <button
              type="button"
              onClick={() => navigate('/conversations/new')}
              className="font-medium text-coral-400 underline-offset-2 hover:underline"
            >
              Nova conversa
            </button>{' '}
            ou abra{' '}
            <code className="text-coral-300/90">/conversations/&lt;id&gt;</code>.
          </p>
        </section>
      ) : null}

      <FutureConversationModal
        open={futureConversationOpen}
        onClose={() => setFutureConversationOpen(false)}
      />
    </div>
  )
}
