import { ChevronRight, Kanban } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CommercialPipelineSectionTitle } from '../components/CommercialPipelineSectionTitle'
import { CommercialFunnel } from '../components/CommercialFunnel'
import { useDetailPanel } from '../context/useDetailPanel'
import {
  commercialPipeStages,
  deals,
  getProjectsByDealId,
} from '../data/mock'
import { getDealWithSessionOverrides } from '../lib/dealSessionStorage'
import { parseDetailKey } from '../lib/detailShare'

function ProjectRowKanbanIcon() {
  return (
    <Kanban
      className="h-4 w-4 shrink-0 text-zinc-500"
      aria-hidden
      strokeWidth={2}
    />
  )
}

export function DealsPage() {
  const { dealId: routeDealId } = useParams<{ dealId?: string }>()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { openDetailPanel } = useDetailPanel()

  const [dealSessionTick, setDealSessionTick] = useState(0)
  useEffect(() => {
    const fn = () => setDealSessionTick((t) => t + 1)
    window.addEventListener('plonge:deal-session', fn)
    return () => window.removeEventListener('plonge:deal-session', fn)
  }, [])

  const activeDeal = useMemo(() => {
    if (!routeDealId || routeDealId === 'new') return undefined
    return getDealWithSessionOverrides(routeDealId)
  }, [routeDealId, dealSessionTick])

  const projectsForDeal = useMemo(() => {
    if (!activeDeal) return []
    return getProjectsByDealId(activeDeal.id)
  }, [activeDeal])

  /** `?detail=deal:…` na lista → URL canónica `/deals/:id`. */
  useEffect(() => {
    if (pathname !== '/deals') return
    const raw = searchParams.get('detail')
    if (!raw) return
    const p = parseDetailKey(raw)
    if (p?.kind !== 'deal' || !p.id) return
    const next = new URLSearchParams(searchParams)
    next.delete('detail')
    const q = next.toString()
    navigate(
      { pathname: `/deals/${p.id}`, search: q ? `?${q}` : '' },
      { replace: true },
    )
  }, [pathname, searchParams, navigate])

  /** Segmento de URL inválido → lista. */
  useEffect(() => {
    if (routeDealId == null || routeDealId === '') return
    if (routeDealId === 'new') return
    if (deals.some((d) => d.id === routeDealId)) return
    navigate('/deals', { replace: true })
  }, [routeDealId, navigate])

  const showNew = routeDealId === 'new'

  return (
    <div className="w-full max-w-none space-y-8">
      {activeDeal ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/deals"
              className="text-sm font-medium text-coral-400/95 underline-offset-2 hover:text-coral-300 hover:underline"
            >
              ← Todos os negócios
            </Link>
          </div>

          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
              {activeDeal.name}
            </h1>
            <p className="text-sm text-[var(--color-plonge-muted)]">
              {activeDeal.stage} · R${' '}
              {(activeDeal.value / 1000).toFixed(0)}k · {activeDeal.prob}% prob.
            </p>
          </header>

          <section className="space-y-3" aria-labelledby="deal-projects-heading">
            <h2
              id="deal-projects-heading"
              className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              Projetos neste negócio
            </h2>
            {projectsForDeal.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/60 px-4 py-8 text-center text-sm text-zinc-500">
                Nenhum projeto vinculado a este negócio no protótipo.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
                {projectsForDeal.map((p) => (
                  <li key={p.id} className="first:rounded-t-xl last:rounded-b-xl">
                    <Link
                      to={`/projects/${p.id}`}
                      className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-zinc-800/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-coral-500/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <ProjectRowKanbanIcon />
                          <span className="font-medium text-[var(--color-plonge-ink)]">
                            {p.name}
                          </span>
                          <span className="rounded-full border border-zinc-600/80 bg-zinc-900/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                            {p.stage}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-snug text-zinc-400">
                          {p.objectiveBrief}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">
                          {p.client} · até {p.dataFimPrevista}
                        </p>
                      </div>
                      <ChevronRight
                        className="mt-1 h-5 w-5 shrink-0 text-zinc-600"
                        aria-hidden
                        strokeWidth={2}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : showNew ? (
        <>
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
              Novo negócio
            </h1>
          </header>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-plonge-muted)]">
            Defina nome, valor e relações no painel à direita. Depois de criado, os projetos
            de entrega aparecem nesta superfície quando estiverem ligados ao negócio.
          </p>
        </>
      ) : (
        <>
          <section className="w-full space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CommercialPipelineSectionTitle />
              </div>
              <Link
                to="/deals/new"
                className="shrink-0 rounded-lg bg-coral-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600"
              >
                Novo negócio
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-sm">
              <CommercialFunnel
                stages={commercialPipeStages}
                onStageClick={(stageId) =>
                  openDetailPanel({ detail: `stage:${stageId}` })
                }
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
