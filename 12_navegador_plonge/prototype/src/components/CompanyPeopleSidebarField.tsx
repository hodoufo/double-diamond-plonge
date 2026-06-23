import { Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { contacts } from '../data/mock'
import {
  COMPANY_STAKEHOLDER_ROLE_LABEL,
  loadCompanyPeopleRows,
  saveCompanyPeopleRows,
  type CompanyPeopleRowPersisted,
  type CompanyStakeholderRole,
} from '../lib/companyPeopleSessionStorage'

const fieldClass =
  'w-full rounded-md border border-zinc-600 bg-zinc-950/90 px-2.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner focus:border-coral-500/60 focus:outline-none focus:ring-2 focus:ring-coral-500/25'

const labelClass = 'mb-1 block text-xs font-medium text-zinc-400'

type RowState = CompanyPeopleRowPersisted

function newRowKey() {
  try {
    return crypto.randomUUID()
  } catch {
    return `cprow-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function createRow(partial?: Partial<RowState>): RowState {
  return {
    key: partial?.key ?? newRowKey(),
    companyRole: partial?.companyRole ?? 'operacional',
    jobTitle: partial?.jobTitle ?? '',
    mode: partial?.mode ?? 'existing',
    contactId: partial?.contactId ?? null,
    contactSearch: partial?.contactSearch ?? '',
    newName: partial?.newName ?? '',
    newEmail: partial?.newEmail ?? '',
    newPhone: partial?.newPhone ?? '',
    newRole: partial?.newRole ?? '',
    newLinkedIn: partial?.newLinkedIn ?? '',
  }
}

type CompanyPeopleSidebarFieldProps = {
  companyId: string
  companyName: string
}

/**
 * Pessoas ligadas à empresa no painel — mesmo fluxo que «Com quem» (contato existente ou novo),
 * com **papel na empresa** e **cargo** editável.
 */
export function CompanyPeopleSidebarField({
  companyId,
  companyName,
}: CompanyPeopleSidebarFieldProps) {
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const [rows, setRows] = useState<RowState[]>(() => [createRow()])
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const roleSelectId = useId()

  useEffect(() => {
    const saved = loadCompanyPeopleRows(companyId)
    setRows(saved && saved.length > 0 ? saved : [createRow()])
    setOpenDropdownKey(null)
  }, [companyId])

  const scheduleSave = useCallback(
    (next: RowState[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveCompanyPeopleRows(companyId, next)
      }, 380)
    },
    [companyId],
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const commitRows = useCallback(
    (updater: RowState[] | ((prev: RowState[]) => RowState[])) => {
      setRows((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        scheduleSave(next)
        return next
      })
    },
    [scheduleSave],
  )

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

  const addRow = useCallback(() => {
    commitRows((prev) => [...prev, createRow({ mode: 'existing' })])
  }, [commitRows])

  const removeRow = useCallback(
    (rowKey: string) => {
      commitRows((prev) => {
        const filtered = prev.filter((r) => r.key !== rowKey)
        return filtered.length === 0 ? [createRow()] : filtered
      })
    },
    [commitRows],
  )

  const updateRow = useCallback(
    (rowKey: string, patch: Partial<RowState>) => {
      commitRows((prev) => prev.map((r) => (r.key === rowKey ? { ...r, ...patch } : r)))
    },
    [commitRows],
  )

  const filteredForRow = useCallback(
    (search: string) => {
      const q = search.trim().toLowerCase()
      const list = contacts
        .filter((c) => {
          if (!q) return true
          const hay = `${c.name}\n${c.role}\n${c.company}`.toLowerCase()
          return hay.includes(q)
        })
        .slice(0, 20)
      return [...list].sort((a, b) => {
        const ma = a.companyId === companyId ? 0 : 1
        const mb = b.companyId === companyId ? 0 : 1
        if (ma !== mb) return ma - mb
        return a.name.localeCompare(b.name, 'pt')
      })
    },
    [companyId],
  )

  return (
    <fieldset
      ref={rootRef}
      className="rounded-xl border border-zinc-700/80 bg-zinc-950/40 p-3 sm:p-4"
    >
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Pessoas na empresa
      </legend>
      <p className="mt-2 text-[11px] leading-snug text-zinc-500">
        Mesmo fluxo de «Com quem»: contato existente ou cadastro rápido. O{' '}
        <strong className="font-medium text-zinc-400">papel</strong> posiciona a pessoa na
        conta; o <strong className="font-medium text-zinc-400">cargo</strong> é o título
        (pode diferir do cartão global do contato).
      </p>

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
              <div className="mb-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <label htmlFor={`${roleSelectId}-cr-${row.key}`} className={labelClass}>
                    Papel na empresa
                  </label>
                  <select
                    id={`${roleSelectId}-cr-${row.key}`}
                    value={row.companyRole}
                    onChange={(e) =>
                      updateRow(row.key, {
                        companyRole: e.target.value as CompanyStakeholderRole,
                      })
                    }
                    className={fieldClass}
                  >
                    {(Object.keys(COMPANY_STAKEHOLDER_ROLE_LABEL) as CompanyStakeholderRole[]).map(
                      (k) => (
                        <option key={k} value={k}>
                          {COMPANY_STAKEHOLDER_ROLE_LABEL[k]}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${roleSelectId}-job-${row.key}`} className={labelClass}>
                    Cargo (nesta empresa)
                  </label>
                  <input
                    id={`${roleSelectId}-job-${row.key}`}
                    value={row.jobTitle}
                    onChange={(e) => updateRow(row.key, { jobTitle: e.target.value })}
                    placeholder="Ex.: Head of People, Diretor comercial…"
                    className={fieldClass}
                    autoComplete="organization-title"
                  />
                </div>
                <div className="flex justify-end pb-0.5 sm:justify-center">
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-600 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                      aria-label={`Remover linha ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div
                className="flex gap-2"
                role="radiogroup"
                aria-label={`Origem do contacto ${index + 1}`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={row.mode === 'existing'}
                  onClick={() => {
                    updateRow(row.key, { mode: 'existing' })
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
                  <label htmlFor={`cp-search-${row.key}`} className={labelClass}>
                    Pesquisar contato
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <input
                      id={`cp-search-${row.key}`}
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
                      Cartão:{' '}
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
                                const nextJob = row.jobTitle.trim() || c.role
                                updateRow(row.key, {
                                  contactId: c.id,
                                  contactSearch: c.name,
                                  jobTitle: nextJob,
                                })
                                setOpenDropdownKey(null)
                              }}
                            >
                              <span className="font-medium">{c.name}</span>
                              <span className="text-[11px] text-zinc-500">
                                {c.role} · {c.company}
                                {c.companyId === companyId ? (
                                  <span className="ml-1 text-teal-400/90">· conta atual</span>
                                ) : null}
                              </span>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="rounded-md border border-zinc-700/80 bg-zinc-900/50 px-2.5 py-2 text-xs text-zinc-400">
                    Empresa:{' '}
                    <span className="font-medium text-zinc-200">{companyName}</span>
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor={`cp-np-name-${row.key}`} className={labelClass}>
                        Nome
                      </label>
                      <input
                        id={`cp-np-name-${row.key}`}
                        value={row.newName}
                        onChange={(e) => updateRow(row.key, { newName: e.target.value })}
                        className={fieldClass}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor={`cp-np-email-${row.key}`} className={labelClass}>
                        E-mail
                      </label>
                      <input
                        id={`cp-np-email-${row.key}`}
                        type="email"
                        value={row.newEmail}
                        onChange={(e) => updateRow(row.key, { newEmail: e.target.value })}
                        className={fieldClass}
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label htmlFor={`cp-np-phone-${row.key}`} className={labelClass}>
                        Telefone
                      </label>
                      <input
                        id={`cp-np-phone-${row.key}`}
                        type="tel"
                        value={row.newPhone}
                        onChange={(e) => updateRow(row.key, { newPhone: e.target.value })}
                        className={fieldClass}
                        autoComplete="tel"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`cp-np-role-${row.key}`} className={labelClass}>
                        Cargo (cadastro)
                      </label>
                      <input
                        id={`cp-np-role-${row.key}`}
                        value={row.newRole}
                        onChange={(e) => updateRow(row.key, { newRole: e.target.value })}
                        className={fieldClass}
                        placeholder="Como no cartão interno / ATS"
                        autoComplete="organization-title"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`cp-np-li-${row.key}`} className={labelClass}>
                        Perfil no LinkedIn
                      </label>
                      <input
                        id={`cp-np-li-${row.key}`}
                        type="url"
                        value={row.newLinkedIn}
                        onChange={(e) => updateRow(row.key, { newLinkedIn: e.target.value })}
                        placeholder="https://www.linkedin.com/in/…"
                        className={fieldClass}
                        autoComplete="off"
                      />
                    </div>
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

      <p className="mt-3 text-[11px] text-zinc-600">
        Rascunho guardado neste navegador em{' '}
        <code className="text-coral-300/80">plonge:company-people:{companyId}</code>
      </p>
    </fieldset>
  )
}
