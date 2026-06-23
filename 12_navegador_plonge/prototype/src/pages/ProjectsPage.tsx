import { Building2, Kanban, TrendingUp } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ProjectStagesSurface } from '../components/ProjectStagesSurface'
import { useDetailPanel } from '../context/useDetailPanel'
import {
  deals,
  getProjectLifecycleStages,
  getRunningProjectById,
  runningProjects,
  type RunningProject,
} from '../data/mock'
import { parseDetailKey } from '../lib/detailShare'

function projectsInProgress(list: RunningProject[]): RunningProject[] {
  return list.filter((p) => p.status === 'em_andamento')
}

/** Ícone alinhado à entrada «Projetos» na barra lateral. */
function ChipProjectIcon() {
  return (
    <Kanban
      className="h-3.5 w-3.5 shrink-0 text-zinc-500"
      aria-hidden
      strokeWidth={2}
    />
  )
}

/** Ícone alinhado à entrada «Empresas» — cliente do projeto. */
function ChipCompanyIcon() {
  return (
    <Building2
      className="h-3.5 w-3.5 shrink-0 text-zinc-500"
      aria-hidden
      strokeWidth={2}
    />
  )
}

/** Ícone alinhado à entrada «Negócios» — deal ligado ao projeto. */
function ChipDealIcon() {
  return (
    <TrendingUp
      className="h-3.5 w-3.5 shrink-0 text-zinc-500"
      aria-hidden
      strokeWidth={2}
    />
  )
}

export function ProjectsPage() {
  const { projectId: projectIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { openDetailPanel, detailKey } = useDetailPanel()

  /** Legado: `/projects?detail=project%3Ap1` → `/projects/p1`. */
  useEffect(() => {
    if (projectIdParam) return
    const detail = searchParams.get('detail')
    if (!detail) return
    const p = parseDetailKey(detail)
    if (p?.kind !== 'project' || !getRunningProjectById(p.id)) return
    const next = new URLSearchParams(searchParams)
    next.delete('detail')
    const q = next.toString()
    navigate(
      {
        pathname: `/projects/${p.id}`,
        search: q ? `?${q}` : '',
      },
      { replace: true },
    )
  }, [navigate, projectIdParam, searchParams])

  useEffect(() => {
    if (projectIdParam) return
    const detail = searchParams.get('detail')
    if (!detail) return
    const parsed = parseDetailKey(detail)
    if (parsed?.kind === 'project') return
    openDetailPanel({ detail })
  }, [openDetailPanel, projectIdParam, searchParams])

  const selectedProjectId = useMemo(() => {
    if (projectIdParam && getRunningProjectById(projectIdParam)) {
      return projectIdParam
    }
    if (!detailKey) return null
    const p = parseDetailKey(detailKey)
    if (!p || p.kind !== 'project') return null
    return getRunningProjectById(p.id)?.id ?? null
  }, [detailKey, projectIdParam])

  const selectedProject = selectedProjectId
    ? getRunningProjectById(selectedProjectId)
    : undefined
  const stages = selectedProjectId ? getProjectLifecycleStages(selectedProjectId) : []

  const list = useMemo(() => projectsInProgress(runningProjects), [])

  const dealLabel = useMemo(() => {
    if (!selectedProject) return ''
    return (
      deals.find((d) => d.id === selectedProject.dealId)?.name ?? 'Negócio'
    )
  }, [selectedProject])

  const chipBase =
    'inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-zinc-600/50 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium'
  const chipStatic = `${chipBase} text-zinc-400`
  const chipLink = `${chipBase} text-zinc-300 transition-colors hover:border-zinc-500/60 hover:bg-zinc-800/80 hover:text-zinc-200`

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        {selectedProject ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className={chipStatic}
              title={selectedProject.name}
              aria-label={`Projeto: ${selectedProject.name}`}
            >
              <ChipProjectIcon />
              <span className="min-w-0 truncate">{selectedProject.name}</span>
            </span>
            <Link
              to={`/companies?detail=company:${selectedProject.clientCompanyId}`}
              className={chipLink}
              title={`Empresa: ${selectedProject.client}`}
            >
              <ChipCompanyIcon />
              <span className="min-w-0 truncate">{selectedProject.client}</span>
            </Link>
            <Link
              to={`/deals/${selectedProject.dealId}`}
              className={chipLink}
              title={`Negócio: ${dealLabel}`}
            >
              <ChipDealIcon />
              <span className="min-w-0 truncate">{dealLabel}</span>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
              Projetos
            </h1>
            <p className="text-sm text-[var(--color-plonge-muted)]">
              Projetos em andamento — clique em uma linha para abrir o cadastro no painel e o
              ciclo de entrega abaixo.
            </p>
          </>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">
          Em andamento ({list.length})
        </h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-plonge-border)] text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Projeto</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Cliente</th>
                <th className="px-4 py-3 font-medium">Recrutamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-plonge-border)]">
              {list.map((row) => {
                const selected = selectedProjectId === row.id
                const open = () => {
                  navigate(`/projects/${row.id}`)
                }
                return (
                  <tr
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer transition-colors ${
                      selected ? 'bg-coral-950/20' : 'hover:bg-zinc-800/30'
                    }`}
                    onClick={open}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        open()
                      }
                    }}
                    aria-label={`Abrir projeto ${row.name}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-[var(--color-plonge-ink)]">
                        {row.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500 sm:hidden">
                        {row.client}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                      {row.client}
                    </td>
                    <td className="px-4 py-3 text-right sm:text-left">
                      <span className="inline-flex rounded-full border border-coral-500/30 bg-coral-500/10 px-2 py-0.5 text-[11px] font-medium text-coral-300">
                        {row.stage}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedProject && stages.length > 0 ? (
        <ProjectStagesSurface stages={stages} />
      ) : (
        <section className="rounded-xl border border-dashed border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--color-plonge-ink)]">
            Nenhum projeto selecionado
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Escolha um projeto na tabela acima para visualizar o cronograma de fases
            (kickoff, descoberta, construção, homologação e go-live). Os dados cadastrais
            ficam no painel à direita.
          </p>
        </section>
      )}
    </div>
  )
}
