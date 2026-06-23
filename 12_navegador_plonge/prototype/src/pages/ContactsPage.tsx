import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ContactCv } from '../components/ContactCv'
import { ContactCvEditable } from '../components/ContactCvEditable'
import { FutureConversationModal } from '../components/FutureConversationModal'
import { useContactNewDraft } from '../context/ContactNewDraftContext'
import { companies, contacts } from '../data/mock'
import { parseDetailKey } from '../lib/detailShare'

const relationStyles = {
  quente: 'border border-rose-500/30 bg-rose-950/80 text-rose-300',
  morno: 'border border-amber-500/30 bg-amber-950/80 text-amber-300',
  frio: 'border border-zinc-600 bg-zinc-800 text-zinc-300',
}

type ContactSelection = { mode: 'none' } | { mode: 'new' } | { mode: 'existing'; id: string }

function deriveContactSelection(
  pathname: string,
  routeContactId: string | undefined,
  detail: string | null,
): ContactSelection {
  if (pathname === '/contacts/new') return { mode: 'new' }

  const parsed = detail ? parseDetailKey(detail) : null
  if (parsed?.kind === 'contact' && parsed.id === 'new') return { mode: 'new' }

  if (routeContactId && contacts.some((c) => c.id === routeContactId)) {
    return { mode: 'existing', id: routeContactId }
  }

  if (
    parsed?.kind === 'contact' &&
    parsed.id !== 'new' &&
    contacts.some((c) => c.id === parsed.id)
  ) {
    return { mode: 'existing', id: parsed.id }
  }

  return { mode: 'none' }
}

export function ContactsPage() {
  const { contactId: routeContactId } = useParams<{ contactId?: string }>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { updateDraft } = useContactNewDraft()
  const appliedCompanyFromUrl = useRef<string | null>(null)

  const detailParam = searchParams.get('detail')
  const [futureConversationOpen, setFutureConversationOpen] = useState(false)

  const selection = useMemo(
    () => deriveContactSelection(pathname, routeContactId, detailParam),
    [pathname, routeContactId, detailParam],
  )

  /** Rota `/contact/:id` válida alinha o query `detail=contact:…` (fonte compartilhada com o painel). */
  useEffect(() => {
    if (routeContactId == null || routeContactId === '') return
    const valid = contacts.some((c) => c.id === routeContactId)
    if (!valid) {
      navigate('/contacts', { replace: true })
      return
    }
    const detailValue = `contact:${routeContactId}`
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (next.get('detail') !== detailValue) {
          next.set('detail', detailValue)
        }
        return next
      },
      { replace: true },
    )
  }, [routeContactId, navigate, setSearchParams])

  /** Rota de rascunho novo contato — mesmo detalhe usado pelo painel (`contact:new`). */
  useEffect(() => {
    if (pathname !== '/contacts/new') return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (next.get('detail') !== 'contact:new') {
          next.set('detail', 'contact:new')
        }
        return next
      },
      { replace: true },
    )
  }, [pathname, setSearchParams])

  /** `?companyId=` (ex.: link desde Empresas) pré-preenche o campo empresa no rascunho. */
  useEffect(() => {
    if (pathname !== '/contacts/new') {
      appliedCompanyFromUrl.current = null
      return
    }
    const id = searchParams.get('companyId')
    if (!id || !companies.some((c) => c.id === id)) return
    if (appliedCompanyFromUrl.current === id) return
    appliedCompanyFromUrl.current = id
    const co = companies.find((c) => c.id === id)!
    updateDraft({ company: co.name })
  }, [pathname, searchParams, updateDraft])

  const showCvColumn = selection.mode !== 'none'
  const selectedContact =
    selection.mode === 'existing' ? contacts.find((c) => c.id === selection.id) : undefined

  /** Com contato ou novo contato, o currículo traz o contexto — remove cabeçalho duplicado. */
  const hideListPageChrome =
    selection.mode === 'existing' || selection.mode === 'new'

  /** Mesmo fluxo que pessoa existente: só currículo na superfície, sem lista ao lado. */
  const hideContactList = selection.mode === 'existing' || selection.mode === 'new'

  return (
    <div className={hideListPageChrome ? undefined : 'space-y-6'}>
      {!hideListPageChrome && (
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
              Contatos
            </h1>
            <p className="text-sm text-[var(--color-plonge-muted)]">
              Pessoas, relações e próximas conversas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/contacts/new"
              className="rounded-lg border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-sm font-medium text-zinc-200 shadow-sm hover:bg-zinc-800"
            >
              + Novo contato
            </Link>
            <button
              type="button"
              onClick={() => setFutureConversationOpen(true)}
              className="rounded-lg bg-coral-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600"
            >
              + Conversa futura
            </button>
          </div>
        </header>
      )}

      <div
        className={
          showCvColumn && !hideContactList
            ? 'grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start'
            : undefined
        }
      >
        {!hideContactList && (
          <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
            {contacts.map((c) => (
                <li
                  key={c.id}
                  className="first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        <Link
                          to={`/contact/${c.id}`}
                          className="text-[var(--color-plonge-ink)] underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-coral-400/80"
                        >
                          {c.name}
                        </Link>
                      </p>
                      <p className="text-sm text-zinc-500">
                        {c.role} · {c.company}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${relationStyles[c.relation]}`}
                    >
                      {c.relation}
                    </span>
                  </div>
                </li>
            ))}
          </ul>
        )}

        {showCvColumn && (
          <section
            className={
              selection.mode === 'new'
                ? 'min-w-0 px-2 py-4 sm:px-4'
                : 'min-w-0 rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/90 px-4 py-6 sm:px-6'
            }
            aria-label="Currículo"
          >
            {selection.mode === 'new' && <ContactCvEditable />}
            {selection.mode === 'existing' && selectedContact && (
              <ContactCv contact={selectedContact} />
            )}
          </section>
        )}
      </div>

      <FutureConversationModal
        open={futureConversationOpen}
        onClose={() => setFutureConversationOpen(false)}
      />
    </div>
  )
}
