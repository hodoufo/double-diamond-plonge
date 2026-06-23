import { Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  companies,
  contacts,
  getConversationById,
  systemUsers,
} from '../data/mock'
import type { ConversationSessionState } from '../lib/conversationSessionStorage'
import {
  loadConversationSession,
  saveConversationSession,
  subscribeConversationSession,
} from '../lib/conversationSessionStorage'

function Card({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </div>
      <div className="text-sm text-[var(--color-plonge-ink)]">{children}</div>
    </div>
  )
}

const inp =
  'mt-1 w-full rounded-md border border-zinc-600 bg-zinc-900/80 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-coral-500/50 focus:outline-none focus:ring-1 focus:ring-coral-500/40'

function newTempId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `qc-${Date.now()}`
  }
}

/** Metadados da conversa no painel direito — participantes internos (equipa) e externos (contatos). */
export function ConversationMetadataSidebar({
  conversationId,
  /** Query `?companyId=` ao criar conversa (ex.: desde Empresas). */
  initialQuickCompanyId,
}: {
  conversationId: string
  initialQuickCompanyId?: string
}) {
  const base = getConversationById(conversationId)
  const [session, setSession] = useState<ConversationSessionState>(() =>
    loadConversationSession(conversationId),
  )

  const [contactSearch, setContactSearch] = useState('')
  const [qcName, setQcName] = useState('')
  const [qcEmail, setQcEmail] = useState('')
  const [qcCompanyId, setQcCompanyId] = useState('')
  const appliedQuickCompanyRef = useRef<string | null>(null)

  useEffect(() => {
    setSession(loadConversationSession(conversationId))
  }, [conversationId])

  useEffect(() => {
    if (conversationId !== 'new') {
      appliedQuickCompanyRef.current = null
      return
    }
    if (!initialQuickCompanyId || !companies.some((c) => c.id === initialQuickCompanyId)) return
    if (appliedQuickCompanyRef.current === initialQuickCompanyId) return
    appliedQuickCompanyRef.current = initialQuickCompanyId
    setQcCompanyId(initialQuickCompanyId)
  }, [conversationId, initialQuickCompanyId])

  useEffect(() => {
    return subscribeConversationSession(() => {
      setSession(loadConversationSession(conversationId))
    })
  }, [conversationId])

  const patch = (p: Partial<ConversationSessionState>) => {
    saveConversationSession(conversationId, p)
    setSession(loadConversationSession(conversationId))
  }

  const toggleUser = (uid: string) => {
    const has = session.internalUserIds.includes(uid)
    patch({
      internalUserIds: has
        ? session.internalUserIds.filter((x) => x !== uid)
        : [...session.internalUserIds, uid],
    })
  }

  const toggleContact = (cid: string) => {
    const has = session.externalContactIds.includes(cid)
    patch({
      externalContactIds: has
        ? session.externalContactIds.filter((x) => x !== cid)
        : [...session.externalContactIds, cid],
    })
  }

  const removeQuick = (tempId: string) => {
    patch({
      quickContacts: session.quickContacts.filter((q) => q.tempId !== tempId),
    })
  }

  const addQuickContact = () => {
    const name = qcName.trim()
    const email = qcEmail.trim()
    if (!name || !email || !qcCompanyId) return
    if (!email.includes('@')) return
    const row = {
      tempId: newTempId(),
      name,
      email,
      companyId: qcCompanyId,
    }
    patch({ quickContacts: [...session.quickContacts, row] })
    setQcName('')
    setQcEmail('')
    setQcCompanyId('')
  }

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase()
    return contacts
      .filter((c) => {
        if (!q) return true
        return `${c.name} ${c.company} ${c.role}`.toLowerCase().includes(q)
      })
      .slice(0, 24)
  }, [contactSearch])

  const tags = base?.tags ?? []

  if (!base) {
    return <p className="text-sm text-zinc-500">Conversa não encontrada.</p>
  }

  return (
    <div className="space-y-3">
      <Card title="Título">
        <input
          type="text"
          value={session.title}
          onChange={(e) => patch({ title: e.target.value })}
          className={inp}
          placeholder="Título da conversa"
          autoComplete="off"
        />
      </Card>

      <Card title="Equipa Plongê (internos)">
        <p className="text-[11px] text-zinc-500">
          Quem da organização participou — utilizadores do sistema.
        </p>
        <ul className="mt-2 space-y-1.5">
          {systemUsers.map((u) => {
            const on = session.internalUserIds.includes(u.id)
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => toggleUser(u.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition-colors ${
                    on
                      ? 'border-coral-500/50 bg-coral-950/35 text-coral-100'
                      : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="truncate text-[10px] text-zinc-500">{u.role}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card title="Contatos (externos)">
        <p className="text-[11px] text-zinc-500">
          Pessoas de cliente ou parceiros cadastrados como contatos.
        </p>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
            strokeWidth={2}
          />
          <input
            type="search"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            placeholder="Filtrar por nome ou empresa…"
            className={`${inp} pl-8`}
          />
        </div>
        <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto pr-1">
          {filteredContacts.map((c) => {
            const on = session.externalContactIds.includes(c.id)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => toggleContact(c.id)}
                  className={`flex w-full flex-col rounded-lg border px-2 py-1.5 text-left text-xs transition-colors ${
                    on
                      ? 'border-coral-500/50 bg-coral-950/35 text-coral-100'
                      : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[10px] text-zinc-500">
                    {c.role} · {c.company}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {session.quickContacts.length > 0 ? (
          <div className="mt-3 border-t border-zinc-700/60 pt-3">
            <p className="text-[11px] font-medium text-zinc-400">
              Adicionados nesta conversa (ainda não na base)
            </p>
            <ul className="mt-2 space-y-2">
              {session.quickContacts.map((q) => {
                const co = companies.find((x) => x.id === q.companyId)
                return (
                  <li
                    key={q.tempId}
                    className="flex items-start justify-between gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-900/40 px-2 py-1.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-200">{q.name}</p>
                      <p className="truncate text-[10px] text-zinc-500">{q.email}</p>
                      <p className="text-[10px] text-zinc-600">{co?.name ?? q.companyId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuick(q.tempId)}
                      className="shrink-0 rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                      aria-label={`Remover ${q.name}`}
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-zinc-700/80 bg-black/30 p-2">
          <p className="text-[11px] font-medium text-zinc-400">Criar contato rápido</p>
          <p className="mt-0.5 text-[10px] leading-snug text-zinc-600">
            Grava neste rascunho; sincroniza com a base depois.
          </p>
          <input
            type="text"
            value={qcName}
            onChange={(e) => setQcName(e.target.value)}
            placeholder="Nome"
            className={`${inp} mt-2`}
          />
          <input
            type="email"
            value={qcEmail}
            onChange={(e) => setQcEmail(e.target.value)}
            placeholder="E-mail"
            className={inp}
          />
          <select
            value={qcCompanyId}
            onChange={(e) => setQcCompanyId(e.target.value)}
            className={inp}
          >
            <option value="">Empresa (cadastrada)…</option>
            {companies.map((co) => (
              <option key={co.id} value={co.id}>
                {co.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addQuickContact}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-coral-600/50 bg-coral-950/30 py-1.5 text-xs font-medium text-coral-100 hover:bg-coral-950/50"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Adicionar à conversa
          </button>
        </div>
      </Card>

      <Card title="Contexto">
        <label className="block text-[11px] text-zinc-500">
          Data / hora (texto)
          <input
            type="text"
            value={session.date}
            onChange={(e) => patch({ date: e.target.value })}
            className={inp}
            placeholder="Ex.: 14/04/2025, 10:00"
          />
        </label>
        <label className="mt-2 block text-[11px] text-zinc-500">
          Canal
          <input
            type="text"
            value={session.channel}
            onChange={(e) => patch({ channel: e.target.value })}
            className={inp}
            placeholder="Meet, Teams, Plia…"
          />
        </label>
        <label className="mt-2 block text-[11px] text-zinc-500">
          Duração (estimativa)
          <input
            type="text"
            value={session.durationPlaceholder}
            onChange={(e) => patch({ durationPlaceholder: e.target.value })}
            className={inp}
            placeholder="~30 min"
          />
        </label>
      </Card>

      {tags.length > 0 ? (
        <Card title="Tags (mock)">
          <p className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-600/80 bg-zinc-900/60 px-2 py-0.5 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </p>
        </Card>
      ) : null}

      <Card title="Ações (mock)">
        <p className="text-zinc-400">Gerar follow-up · Gerar negócio</p>
      </Card>
    </div>
  )
}
