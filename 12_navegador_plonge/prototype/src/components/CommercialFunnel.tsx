import type { CSSProperties } from 'react'
import type { CommercialPipeStage } from '../data/mock'
import { stripLeadingStageIndex } from '../lib/detailShare'

export function CommercialFunnel({
  stages,
  onStageClick,
}: {
  stages: readonly CommercialPipeStage[]
  /** Abre painel de detalhe ao clicar numa etapa do pipe */
  onStageClick?: (stageId: string) => void
}) {
  const maxCount = Math.max(...stages.map((s) => s.count))

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-black p-4 sm:p-5">
      {stages.map((stage) => {
        const widthPct = Math.max(24, Math.round((stage.count / maxCount) * 100))

        return (
          <div
            key={stage.id}
            className={`flex min-h-0 flex-row items-stretch gap-2 sm:gap-3 md:gap-6 ${onStageClick ? 'cursor-pointer rounded-xl outline-none ring-offset-2 ring-offset-black transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-coral-500/50' : ''}`}
            role={onStageClick ? 'button' : undefined}
            tabIndex={onStageClick ? 0 : undefined}
            onClick={() => onStageClick?.(stage.id)}
            onKeyDown={
              onStageClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onStageClick(stage.id)
                    }
                  }
                : undefined
            }
          >
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div
                className="flex min-h-11 w-[var(--commercial-bar-pct)] max-w-full flex-1 shrink-0 items-center overflow-hidden rounded-xl px-3 py-2 shadow-sm sm:px-4 md:px-5"
                style={
                  {
                    ['--commercial-bar-pct' as string]: `${widthPct}%`,
                    backgroundColor: stage.barBg,
                  } as CSSProperties
                }
              >
                <p className="min-w-0 flex-1 truncate whitespace-nowrap text-sm font-semibold leading-none text-white drop-shadow-sm sm:text-[15px]">
                  {stripLeadingStageIndex(stage.title)}
                </p>
              </div>
            </div>

            <div className="pointer-events-none flex w-[min(100%,7.5rem)] shrink-0 flex-col items-end justify-center gap-1 text-right pl-0.5 sm:w-[8.5rem] sm:pl-1 md:w-[9.5rem] md:pl-2">
              <p className="leading-tight">
                <span className="text-base font-semibold tabular-nums text-white sm:text-lg md:text-xl">
                  {stage.count}
                </span>
                <span className="text-[10px] font-normal text-zinc-500 sm:text-xs">
                  {' '}
                  negócios
                </span>
              </p>
              <p className="flex min-h-[1.35rem] max-w-full flex-nowrap items-center justify-end gap-x-1.5 text-[10px] leading-tight sm:min-h-[1.45rem] sm:gap-x-2 sm:text-[11px] md:text-xs">
                {stage.source === 'plia' && stage.pipelineValue != null ? (
                  <>
                    <span className="shrink font-medium tabular-nums text-white">
                      {stage.pipelineValue}
                    </span>
                    {stage.missingValueNote != null ? (
                      <span className="shrink-0 whitespace-nowrap text-red-400">
                        {stage.missingValueNote}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        )
      })}

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-3 text-xs text-white sm:text-sm"
        aria-label="Legenda da origem dos dados"
      >
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm bg-[#c0807a]"
            aria-hidden
          />
          <span>Planilha Contatos</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm bg-[#14b8a6]"
            aria-hidden
          />
          <span>Plia</span>
        </div>
      </div>
    </div>
  )
}
