import { Plus, Search, Trash2 } from 'lucide-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { companies, contacts } from '../data/mock'

const fieldClass =
  'w-full rounded-md border border-zinc-600 bg-zinc-950/90 px-2.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner focus:border-coral-500/60 focus:outline-none focus:ring-2 focus:ring-coral-500/25'

const labelClass = 'mb-1 block text-xs font-medium text-zinc-400'

/** Papel da pessoa nesta reunião agendada. */
export type MeetingParticipantRole = 'primary' | 'side'

export type FutureConversationParticipantEntry =
  | {
      meetingRole: MeetingParticipantRole
      mode: 'existing'
      contactId: string
      displayName: string
    }
  | {
      meetingRole: MeetingParticipantRole
      mode: 'new'
      name: string
      email: string
      phone: string
      role: string
      companyId: string
      companyName: string
      linkedInProfile: string
    }

type ParticipantMode = 'existing' | 'new'

type RowState = {
  key: string
  meetingRole: MeetingParticipantRole
  mode: ParticipantMode
  contactId: string | null
  contactSearch: string
  newName: string
  newEmail: string
  newPhone: string
  newRole: string
  newCompanyId: string
  newLinkedIn: string
}

function newRowKey() {
  try {
    return crypto.randomUUID()
  } catch {
    return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function createRow(partial?: Partial<RowState>): RowState {
  return {
    key: partial?.key ?? newRowKey(),
    meetingRole: partial?.meetingRole ?? 'side',
    mode: partial?.mode ?? 'existing',
    contactId: partial?.contactId ?? null,
    contactSearch: partial?.contactSearch ?? '',
    newName: partial?.newName ?? '',
    newEmail: partial?.newEmail ?? '',
    newPhone: partial?.newPhone ?? '',
    newRole: partial?.newRole ?? '',
    newCompanyId: partial?.newCompanyId ?? '',
    newLinkedIn: partial?.newLinkedIn ?? '',
  }
}

/** Garante exatamente um interlocutor principal quando há linhas. */
function ensureOnePrimary(rows: RowState[]): RowState[] {
  if (rows.length === 0) return rows
  const primaryCount = rows.filter((r) => r.meetingRole === 'primary').length
  if (primaryCount === 0) {
    return rows.map((r, i) => (i === 0 ? { ...r, meetingRole: 'primary' } : r))
  }
  if (primaryCount > 1) {
    let kept = false
    return rows.map((r) => {
      if (r.meetingRole !== 'primary') return r
      if (!kept) {
        kept = true
        return r
      }
      return { ...r, meetingRole: 'side' }
    })
  }
  return rows
}

export type ConversationWithWhomFieldHandle = {
  validate: () => boolean
  getParticipants: () => FutureConversationParticipantEntry[] | null
}

export type ConversationWithWhomFieldProps = {
  /** Quando abre, reinicia linhas e aplica contato inicial na primeira linha. */
  open: boolean
  initialContactId?: string
  /** Texto do `<legend>` (fieldset). */
  legend?: string
  className?: string
}

export const ConversationWithWhomField = forwardRef<
  ConversationWithWhomFieldHandle,
  ConversationWithWhomFieldProps
>(function ConversationWithWhomField(
  { open, initialContactId, legend = 'Com quem', className = '' },
  ref,
) {
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const [rows, setRows] = useState<RowState[]>(() => [
    createRow({ meetingRole: 'primary', mode: 'existing' }),
  ])
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null)
  const [participantError, setParticipantError] = useState<string | null>(null)

  const roleSelectId = useId()

  useEffect(() => {
    if (!open) return
    const initial =
      initialContactId && contacts.some((c) => c.id === initialContactId)
        ? initialContactId
        : null
    const contact = initial ? contacts.find((c) => c.id === initial)! : null
    setRows([
      createRow({
        meetingRole: 'primary',
        mode: 'existing',
        contactId: initial,
        contactSearch: contact?.name ?? '',
      }),
    ])
    setOpenDropdownKey(null)
    setParticipantError(null)
  }, [open, initialContactId])

  useEffect(() => {
    if (!openDropdownKey) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpenDropdownKey(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openDropdownKey])

  const setMeetingRole = useCallback((rowKey: string, role: MeetingParticipantRole) => {
    setRows((prev) => {
      const next = prev.map((r) => {
        if (r.key !== rowKey) {
          return role === 'primary' ? { ...r, meetingRole: 'side' as const } : r
        }
        return { ...r, meetingRole: role }
      })
      return ensureOnePrimary(next)
    })
  }, [])

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createRow({ meetingRole: 'side', mode: 'existing' })])
  }, [])

  const removeRow = useCallback((rowKey: string) => {
    setRows((prev) => {
      const filtered = prev.filter((r) => r.key !== rowKey)
      return filtered.length === 0 ? [createRow({ meetingRole: 'primary' })] : ensureOnePrimary(filtered)
    })
  }, [])

  const updateRow = useCallback((rowKey: string, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r) => (r.key === rowKey ? { ...r, ...patch } : r)))
  }, [])

  const buildEntry = useCallback((r: RowState): FutureConversationParticipantEntry | null => {
    if (r.mode === 'existing') {
      if (!r.contactId) return null
      const c = contacts.find((x) => x.id === r.contactId)
      if (!c) return null
      return {
        meetingRole: r.meetingRole,
        mode: 'existing',
        contactId: r.contactId,
        displayName: c.name,
      }
    }
    const co = companies.find((x) => x.id === r.newCompanyId)
    return {
      meetingRole: r.meetingRole,
      mode: 'new',
      name: r.newName.trim(),
      email: r.newEmail.trim(),
      phone: r.newPhone.trim(),
      role: r.newRole.trim(),
      companyId: r.newCompanyId,
      companyName: co?.name ?? '',
      linkedInProfile: r.newLinkedIn.trim(),
    }
  }, [])

  const validate = useCallback((): boolean => {
    const primaryRows = rows.filter((r) => r.meetingRole === 'primary')
    if (primaryRows.length !== 1) {
      setParticipantError('Defina exatamente um interlocutor principal.')
      return false
    }
    for (const r of rows) {
      if (r.mode === 'existing') {
        if (!r.contactId) {
          setParticipantError('Em cada linha, escolha um contato ou preencha uma nova pessoa.')
          return false
        }
        continue
      }
      if (!r.newName.trim()) {
        setParticipantError('Informe o nome em «Nova pessoa».')
        return false
      }
      if (!r.newEmail.trim()) {
        setParticipantError('Informe o e-mail em «Nova pessoa».')
        return false
      }
      if (!r.newEmail.includes('@')) {
        setParticipantError('E-mail inválido em «Nova pessoa».')
        return false
      }
      if (!r.newPhone.trim()) {
        setParticipantError('Informe o telefone em «Nova pessoa».')
        return false
      }
      if (!r.newRole.trim()) {
        setParticipantError('Informe o cargo em «Nova pessoa».')
        return false
      }
      if (!r.newCompanyId) {
        setParticipantError('Selecione uma empresa cadastrada em «Nova pessoa».')
        return false
      }
      if (!r.newLinkedIn.trim()) {
        setParticipantError('Informe o perfil no LinkedIn em «Nova pessoa».')
        return false
      }
    }
    setParticipantError(null)
    return true
  }, [rows])

  const getParticipants = useCallback((): FutureConversationParticipantEntry[] | null => {
    const out: FutureConversationParticipantEntry[] = []
    for (const r of rows) {
      const e = buildEntry(r)
      if (!e) return null
      out.push(e)
    }
    return out
  }, [rows, buildEntry])

  useImperativeHandle(ref, () => ({ validate, getParticipants }), [validate, getParticipants])

  const filteredForRow = useCallback((search: string) => {
    const q = search.trim().toLowerCase()
    return contacts
      .filter((c) => {
        if (!q) return true
        const hay = `${c.name}\n${c.role}\n${c.company}`.toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 14)
  }, [])

  return (
    <fieldset
      ref={rootRef}
      className={`rounded-xl border border-zinc-700/80 bg-zinc-950/40 p-3 sm:p-4 ${className}`}
    >
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {legend}
      </legend>

      <div className="mt-3 space-y-4">
        {rows.map((row, index) => {
          const filtered = filteredForRow(row.contactSearch)
          const selectedContact = row.contactId
            ? contacts.find((c) => c.id === row.contactId)
            : undefined

          return (
            <div
              key={row.key}
              className="rounded-lg border border-zinc-700/60 bg-zinc-950/50 p-3"
            >
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                <div className="min-w-[12rem] flex-1">
                  <label htmlFor={`${roleSelectId}-${row.key}`} className={labelClass}>
                    Papel na reunião
                  </label>
                  <select
                    id={`${roleSelectId}-${row.key}`}
                    value={row.meetingRole}
                    onChange={(e) =>
                      setMeetingRole(row.key, e.target.value as MeetingParticipantRole)
                    }
                    className={fieldClass}
                  >
                    <option value="primary">Interlocutor principal</option>
                    <option value="side">Também na mesa</option>
                  </select>
                </div>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-600 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                    aria-label={`Remover pessoa ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                ) : null}
              </div>

              <div
                className="flex gap-2"
                role="radiogroup"
                aria-label={`Tipo de participante ${index + 1}`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={row.mode === 'existing'}
                  onClick={() => {
                    updateRow(row.key, { mode: 'existing' })
                    setParticipantError(null)
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    row.mode === 'existing'
                      ? 'border-coral-500/60 bg-coral-950/40 text-coral-100'
                      : 'border-zinc-600 bg-zinc-900/80 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  Contato existente
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={row.mode === 'new'}
                  onClick={() => {
                    updateRow(row.key, { mode: 'new' })
                    setParticipantError(null)
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    row.mode === 'new'
                      ? 'border-coral-500/60 bg-coral-950/40 text-coral-100'
                      : 'border-zinc-600 bg-zinc-900/80 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  Nova pessoa
                </button>
              </div>

              {row.mode === 'existing' ? (
                <div className="relative mt-4">
                  <label htmlFor={`cw-search-${row.key}`} className={labelClass}>
                    Pesquisar contato
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <input
                      id={`cw-search-${row.key}`}
                      value={row.contactSearch}
                      onChange={(e) => {
                        updateRow(row.key, { contactSearch: e.target.value })
                        setOpenDropdownKey(row.key)
                      }}
                      onFocus={() => setOpenDropdownKey(row.key)}
                      placeholder="Nome, cargo ou empresa…"
                      autoComplete="off"
                      className={`${fieldClass} pl-9`}
                    />
                  </div>
                  {selectedContact ? (
                    <p className="mt-2 text-xs text-zinc-400">
                      Selecionado:{' '}
                      <span className="font-medium text-zinc-200">{selectedContact.name}</span>{' '}
                      · {selectedContact.role} · {selectedContact.company}
                    </p>
                  ) : null}
                  {openDropdownKey === row.key ? (
                    <ul
                      role="listbox"
                      className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-10 max-h-44 overflow-y-auto rounded-lg border border-zinc-600 bg-zinc-950 py-1 shadow-lg ring-1 ring-black/40"
                    >
                      {filtered.length === 0 ? (
                        <li className="px-3 py-2 text-xs text-zinc-500">
                          Nenhum contato encontrado.
                        </li>
                      ) : (
                        filtered.map((c) => (
                          <li key={c.id} role="presentation">
                            <button
                              type="button"
                              role="option"
                              aria-selected={row.contactId === c.id}
                              className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/90 focus:bg-zinc-800/90 focus:outline-none"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                updateRow(row.key, {
                                  contactId: c.id,
                                  contactSearch: c.name,
                                })
                                setOpenDropdownKey(null)
                                setParticipantError(null)
                              }}
                            >
                              <span className="font-medium">{c.name}</span>
                              <span className="text-[11px] text-zinc-500">
                                {c.role} · {c.company}
                              </span>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={`cw-np-name-${row.key}`} className={labelClass}>
                      Nome
                    </label>
                    <input
                      id={`cw-np-name-${row.key}`}
                      value={row.newName}
                      onChange={(e) => updateRow(row.key, { newName: e.target.value })}
                      className={fieldClass}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor={`cw-np-email-${row.key}`} className={labelClass}>
                      E-mail
                    </label>
                    <input
                      id={`cw-np-email-${row.key}`}
                      type="email"
                      value={row.newEmail}
                      onChange={(e) => updateRow(row.key, { newEmail: e.target.value })}
                      className={fieldClass}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor={`cw-np-phone-${row.key}`} className={labelClass}>
                      Telefone
                    </label>
                    <input
                      id={`cw-np-phone-${row.key}`}
                      type="tel"
                      value={row.newPhone}
                      onChange={(e) => updateRow(row.key, { newPhone: e.target.value })}
                      className={fieldClass}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor={`cw-np-role-${row.key}`} className={labelClass}>
                      Cargo
                    </label>
                    <input
                      id={`cw-np-role-${row.key}`}
                      value={row.newRole}
                      onChange={(e) => updateRow(row.key, { newRole: e.target.value })}
                      className={fieldClass}
                      autoComplete="organization-title"
                    />
                  </div>
                  <div>
                    <label htmlFor={`cw-np-company-${row.key}`} className={labelClass}>
                      Empresa (cadastrada)
                    </label>
                    <select
                      id={`cw-np-company-${row.key}`}
                      value={row.newCompanyId}
                      onChange={(e) => updateRow(row.key, { newCompanyId: e.target.value })}
                      className={fieldClass}
                    >
                      <option value="">Selecione a empresa…</option>
                      {companies.map((co) => (
                        <option key={co.id} value={co.id}>
                          {co.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`cw-np-li-${row.key}`} className={labelClass}>
                      Perfil no LinkedIn
                    </label>
                    <input
                      id={`cw-np-li-${row.key}`}
                      type="url"
                      value={row.newLinkedIn}
                      onChange={(e) => updateRow(row.key, { newLinkedIn: e.target.value })}
                      placeholder="https://www.linkedin.com/in/…"
                      className={fieldClass}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-900/40 px-3 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/50"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Adicionar pessoa
      </button>

      {participantError ? (
        <p className="mt-3 text-xs font-medium text-red-400" role="alert">
          {participantError}
        </p>
      ) : null}
    </fieldset>
  )
})
