import type { Contact } from '../data/mock'

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-8 border-b border-[var(--color-plonge-border)] pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 first:mt-0">
      {children}
    </h2>
  )
}

/** Currículo somente leitura na superfície Plia — tipografia escura alinhada ao tema */
export function ContactCv({ contact }: { contact: Contact }) {
  const cv = contact.curriculum

  return (
    <article className="mx-auto max-w-prose text-[15px] leading-relaxed text-[var(--color-plonge-ink)]">
      <header className="border-b border-[var(--color-plonge-border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
          {contact.name}
        </h1>
        <p className="mt-1 text-[var(--color-plonge-muted)]">
          {contact.role} · {contact.company}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <li className="rounded-md border border-zinc-700/60 bg-zinc-900/70 px-2 py-0.5 text-zinc-300">
            <span className="text-zinc-500">Estratégia:</span>{' '}
            <span className="text-zinc-200">{contact.estrategia}</span>
          </li>
          <li className="rounded-md border border-zinc-700/60 bg-zinc-900/70 px-2 py-0.5 text-zinc-300">
            <span className="text-zinc-500">Origem:</span>{' '}
            <span className="text-zinc-200">{contact.origem}</span>
          </li>
          <li className="rounded-md border border-zinc-700/60 bg-zinc-900/70 px-2 py-0.5 text-zinc-300">
            <span className="text-zinc-500">Status:</span>{' '}
            <span className="text-zinc-200">{contact.status}</span>
          </li>
        </ul>
      </header>

      <SectionTitle>Resumo</SectionTitle>
      <div className="mt-3 space-y-3 text-[var(--color-plonge-muted)]">
        {cv.resumo.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <SectionTitle>Experiência</SectionTitle>
      <ul className="mt-3 space-y-6">
        {cv.experiencia.map((job, ji) => (
          <li key={ji}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-[var(--color-plonge-ink)]">{job.cargo}</span>
              <span className="text-xs tabular-nums text-zinc-500">{job.periodo}</span>
            </div>
            <p className="text-sm text-coral-300/90">{job.empresa}</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--color-plonge-muted)]">
              {job.descricao.map((line, li) => (
                <li key={li}>{line}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <SectionTitle>Formação</SectionTitle>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--color-plonge-muted)]">
        {cv.formacao.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      <SectionTitle>Competências</SectionTitle>
      <ul className="mt-3 flex flex-wrap gap-2">
        {cv.competencias.map((s, i) => (
          <li
            key={i}
            className="rounded-md border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)] px-2.5 py-1 text-xs text-zinc-300"
          >
            {s}
          </li>
        ))}
      </ul>
    </article>
  )
}
