import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CompanyRelationGraph } from '../components/CompanyRelationGraph'
import { useDetailPanel } from '../context/useDetailPanel'
import { companies, contacts } from '../data/mock'
import { getRecentCompaniesWithMeta } from '../lib/companyRecentAccess'
import { parseDetailKey } from '../lib/detailShare'

function resolveFocalCompanyId(detailKey: string | null): string | null {
  if (!detailKey) return null
  const p = parseDetailKey(detailKey)
  if (!p) return null
  if (p.kind === 'company') {
    return companies.some((co) => co.id === p.id) ? p.id : null
  }
  if (p.kind === 'contact') {
    const cid = contacts.find((x) => x.id === p.id)?.companyId
    if (!cid || !companies.some((co) => co.id === cid)) return null
    return cid
  }
  return null
}

function formatRecentWhen(ts: number): string {
  try {
    return new Date(ts).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function CompaniesPage() {
  const [searchParams] = useSearchParams()
  const { openDetailPanel, detailKey } = useDetailPanel()
  const [recentTick, setRecentTick] = useState(0)

  useEffect(() => {
    const detail = searchParams.get('detail')
    if (!detail) return
    openDetailPanel({ detail })
  }, [openDetailPanel, searchParams])

  useEffect(() => {
    const onRecent = () => setRecentTick((t) => t + 1)
    window.addEventListener('plonge:company-recent', onRecent)
    return () => window.removeEventListener('plonge:company-recent', onRecent)
  }, [])

  const focalCompanyId = useMemo(
    () => resolveFocalCompanyId(detailKey),
    [detailKey],
  )

  const focalCompany = useMemo(
    () =>
      focalCompanyId ? companies.find((c) => c.id === focalCompanyId) ?? null : null,
    [focalCompanyId],
  )

  const recentRows = useMemo(() => {
    return getRecentCompaniesWithMeta(10)
      .map((r) => {
        const company = companies.find((c) => c.id === r.companyId)
        if (!company) return null
        return { ...r, company }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [recentTick])

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
          Empresas
        </h1>
        <p className="text-sm text-[var(--color-plonge-muted)]">
          As 10 empresas mais recentes que abriu ou que foram citadas em negócios, projetos,
          contatos ou conversas — atualiza ao navegar noutros módulos.
        </p>
      </header>

      {focalCompanyId ? (
        <section className="relative overflow-hidden rounded-xl border border-[var(--color-plonge-border)] shadow-inner">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(196,154,140,0.08))]" />
          <div className="relative p-4 sm:p-6">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
              Mapa de relações
            </p>
            <CompanyRelationGraph
              focalCompanyId={focalCompanyId}
              maxHops={2}
              onCompanyNodeClick={(id) =>
                openDetailPanel({ detail: `company:${id}` })
              }
              onContactNodeClick={(id) =>
                openDetailPanel({ detail: `contact:${id}` })
              }
            />
          </div>
        </section>
      ) : null}

      {focalCompany ? (
        <section className="rounded-xl border border-coral-500/25 bg-coral-950/20 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-coral-400/90">
            Conta em foco
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--color-plonge-ink)]">{focalCompany.name}</p>
          <p className="mt-2 text-[11px] leading-snug text-zinc-500">
            Abrir registos já associados a esta empresa — campos pré-preenchidos onde aplicável.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to={`/contacts/new?companyId=${encodeURIComponent(focalCompany.id)}`}
              className="rounded-lg border border-zinc-600 bg-zinc-900/90 px-3 py-2 text-sm font-medium text-zinc-100 shadow-sm hover:bg-zinc-800"
            >
              Novo contato
            </Link>
            <Link
              to={`/conversations/new?companyId=${encodeURIComponent(focalCompany.id)}`}
              className="rounded-lg bg-coral-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600"
            >
              Nova conversa
            </Link>
          </div>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">
          Últimas empresas (outros módulos)
        </h2>
        <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
          {recentRows.map((row) => {
            const selected = focalCompanyId === row.company.id
            return (
              <li key={row.company.id}>
                <button
                  type="button"
                  className={`flex w-full flex-col gap-1 px-4 py-4 text-left transition first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-800/40 ${
                    selected ? 'bg-coral-950/25 ring-1 ring-inset ring-coral-500/30' : ''
                  }`}
                  onClick={() => openDetailPanel({ detail: `company:${row.company.id}` })}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--color-plonge-ink)]">{row.company.name}</p>
                      <p className="text-sm text-zinc-500">{row.company.industry}</p>
                    </div>
                    <span className="text-sm text-zinc-400">{row.company.size}</span>
                  </div>
                  <p className="text-[11px] leading-snug text-zinc-500">
                    <span className="text-zinc-400">{row.lastSource}</span>
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span className="tabular-nums">{formatRecentWhen(row.lastAt)}</span>
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
