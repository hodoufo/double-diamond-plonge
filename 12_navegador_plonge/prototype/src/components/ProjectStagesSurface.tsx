import type { ProjectLifecycleStage } from '../data/mock'

type ProjectStagesSurfaceProps = {
  stages: ProjectLifecycleStage[]
}

export function ProjectStagesSurface({ stages }: ProjectStagesSurfaceProps) {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h2 className="text-sm font-semibold text-[var(--color-plonge-ink)]">Ciclo de entrega</h2>

      <ol className="relative space-y-0 pl-1">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1
          const dotClass =
            stage.status === 'concluida'
              ? 'border-coral-500 bg-coral-500'
              : stage.status === 'em_andamento'
                ? 'border-coral-400 bg-zinc-950 ring-2 ring-coral-500/50'
                : 'border-zinc-600 bg-zinc-900'

          return (
            <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast ? (
                <div
                  className="absolute left-[11px] top-6 h-[calc(100%-0.5rem)] w-px bg-zinc-700"
                  aria-hidden
                />
              ) : null}
              <div
                className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 ${dotClass}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1 pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-[var(--color-plonge-ink)]">{stage.label}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      stage.status === 'concluida'
                        ? 'border border-zinc-600 bg-zinc-900 text-zinc-400'
                        : stage.status === 'em_andamento'
                          ? 'border border-coral-500/40 bg-coral-950/40 text-coral-300'
                          : 'border border-zinc-700 bg-zinc-900/80 text-zinc-500'
                    }`}
                  >
                    {stage.status === 'concluida'
                      ? 'Concluída'
                      : stage.status === 'em_andamento'
                        ? 'Em andamento'
                        : 'Pendente'}
                  </span>
                </div>
                {stage.periodo ? (
                  <p className="mt-1 text-xs text-zinc-500">{stage.periodo}</p>
                ) : null}
                {stage.detalhe ? (
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{stage.detalhe}</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
