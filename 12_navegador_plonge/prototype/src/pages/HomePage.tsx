import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CommercialPipelineSectionTitle } from '../components/CommercialPipelineSectionTitle'
import { CommercialFunnel } from '../components/CommercialFunnel'
import {
  commercialPipeStages,
  contacts,
  currentUser,
  DEFAULT_KB_DOC_ID,
  runningProjects,
  upcomingTasks,
} from '../data/mock'

/** Frases variadas (PT-BR); índice escolhido uma vez por montagem da página. */
const HOME_GREETING_LINES: Array<(firstName: string) => string> = [
  (n) => `Bom dia, ${n}.`,
  (n) => `Boa tarde, ${n}.`,
  (n) => `Ótimo te ver por aqui, ${n}.`,
  (n) => `${n}, pronto para focar no que vem agora?`,
  (n) => `Que bom ter você de volta, ${n}.`,
  (n) => `Olá, ${n} — vamos ao que importa hoje.`,
  (n) => `Hey, ${n}. Respira fundo e siga em frente.`,
  (n) => `${n}, seu dia na Plongê começa por aqui.`,
  (n) => `Pronto para continuar de onde parou, ${n}?`,
  (n) => `Um bom momento para organizar o funil, ${n}.`,
  (n) => `${n}, as próximas tarefas estão logo abaixo.`,
  (n) => `Saudações, ${n}.`,
]

function greetingFirstName(): string {
  const raw = currentUser?.name?.trim() || contacts[0]?.name?.trim()
  if (!raw) return 'você'
  return raw.split(/\s+/)[0] || 'você'
}

export function HomePage() {
  const navigate = useNavigate()

  const [showGreeting, setShowGreeting] = useState(true)

  const greetingText = useMemo(() => {
    const name = greetingFirstName()
    const pick =
      HOME_GREETING_LINES[
        Math.floor(Math.random() * HOME_GREETING_LINES.length)
      ] ?? HOME_GREETING_LINES[0]
    return pick(name)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      setShowGreeting(false)
    }, 10_000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="w-full max-w-none space-y-8">
      {showGreeting ? (
        <p
          className="text-sm font-normal leading-relaxed tracking-tight text-zinc-500"
          aria-live="polite"
        >
          {greetingText}
        </p>
      ) : null}

      <section>
        <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
          {upcomingTasks.map((t) => (
            <li
              key={t.id}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-800/30"
              onClick={() =>
                navigate(
                  `/deals?detail=${encodeURIComponent(`task:${t.id}`)}`,
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(
                    `/deals?detail=${encodeURIComponent(`task:${t.id}`)}`,
                  )
                }
              }}
              aria-label={`Abrir detalhe: ${t.title}`}
              tabIndex={0}
            >
              <span
                className="inline-flex shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  readOnly
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 accent-coral-500"
                  aria-label={t.title}
                  tabIndex={-1}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    t.done
                      ? 'text-sm text-zinc-400 line-through'
                      : 'text-sm text-[var(--color-plonge-ink)]'
                  }
                >
                  {t.title}
                </p>
              </div>
              <span className="shrink-0 text-xs text-zinc-500">{t.due}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
        {[
          {
            label: 'Contato',
            onClick: () => navigate('/contacts/new'),
          },
          {
            label: 'Negócio',
            onClick: () =>
              navigate('/deals/new'),
          },
          {
            label: 'Conhecimento',
            onClick: () =>
              navigate(`/kb/${encodeURIComponent(DEFAULT_KB_DOC_ID)}`),
          },
        ].map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="inline-flex min-h-[3rem] min-w-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-1.5 py-3 text-center text-xs font-medium text-[var(--color-plonge-ink)] shadow-sm hover:bg-zinc-800 sm:gap-2 sm:px-4 sm:py-4 sm:text-base"
          >
            <Plus className="h-4 w-4 shrink-0 text-coral-400 sm:h-5 sm:w-5" />
            <span className="min-w-0 leading-tight">{label}</span>
          </button>
        ))}
      </div>

      <section className="grid w-full gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3">
          <CommercialPipelineSectionTitle />
          <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-sm">
            <CommercialFunnel
              stages={commercialPipeStages}
              onStageClick={(stageId) =>
                navigate(
                  `/deals?detail=${encodeURIComponent(`stage:${stageId}`)}`,
                )
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[var(--color-plonge-ink)]">
            Projetos em andamento
          </h2>
          <ul className="divide-y divide-[var(--color-plonge-border)] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]">
            {runningProjects.map((p) => (
              <li key={p.id} className="first:rounded-t-xl last:rounded-b-xl">
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-snug text-[var(--color-plonge-ink)]">
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{p.client}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-coral-500/30 bg-coral-500/15 px-2 py-0.5 text-[11px] font-medium leading-none text-coral-300">
                    {p.stage}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
