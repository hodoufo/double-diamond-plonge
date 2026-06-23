import {
  CONTACT_ORIGINS,
  CONTACT_STATUSES,
  CONTACT_STRATEGIES,
} from '../data/mock'
import { useContactNewDraft } from '../context/ContactNewDraftContext'

/** Linha única — só placeholder (cinza claro), sem caixa de formulário */
const lineClass =
  'w-full border-0 border-b border-zinc-700/30 bg-transparent py-2.5 text-[15px] leading-snug text-[var(--color-plonge-ink)] outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500/45 focus:ring-0'

/** Select com aparência de linha — placeholder em cinza claro quando vazio */
const selectClass =
  'w-full appearance-none border-0 border-b border-zinc-700/30 bg-transparent py-2.5 text-[15px] leading-snug outline-none transition-colors focus:border-zinc-500/45 focus:ring-0'

/** Bloco de texto — fundo transparente, só divisão suave */
const blockClass =
  'mt-10 w-full resize-y border-0 border-b border-zinc-700/30 bg-transparent py-2.5 text-[15px] leading-relaxed text-[var(--color-plonge-ink)] outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500/45 focus:ring-0'

/** Currículo editável na superfície Plia — campos em branco, sem rótulos */
export function ContactCvEditable() {
  const { draft, updateDraft, finalizeBlur } = useContactNewDraft()

  return (
    <article className="mx-auto max-w-prose pb-16 pt-1 text-[15px] leading-relaxed">
      <div className="space-y-0">
        <input
          type="text"
          value={draft.role}
          onChange={(e) => updateDraft({ role: e.target.value })}
          onBlur={finalizeBlur}
          placeholder="Cargo"
          autoComplete="off"
          className={lineClass}
          aria-label="Cargo"
        />
        <input
          type="text"
          value={draft.company}
          onChange={(e) => updateDraft({ company: e.target.value })}
          onBlur={finalizeBlur}
          placeholder="Empresa"
          autoComplete="organization"
          className={lineClass}
          aria-label="Empresa"
        />
        <select
          value={draft.estrategia}
          onChange={(e) => updateDraft({ estrategia: e.target.value })}
          onBlur={finalizeBlur}
          aria-label="Estratégia"
          className={`${selectClass} ${draft.estrategia === '' ? 'text-zinc-500' : 'text-[var(--color-plonge-ink)]'}`}
        >
          <option value="" className="text-zinc-500">
            Estratégia
          </option>
          {CONTACT_STRATEGIES.map((s) => (
            <option key={s} value={s} className="text-[var(--color-plonge-ink)]">
              {s}
            </option>
          ))}
        </select>
        <select
          value={draft.origem}
          onChange={(e) => updateDraft({ origem: e.target.value })}
          onBlur={finalizeBlur}
          aria-label="Origem"
          className={`${selectClass} ${draft.origem === '' ? 'text-zinc-500' : 'text-[var(--color-plonge-ink)]'}`}
        >
          <option value="" className="text-zinc-500">
            Origem
          </option>
          {CONTACT_ORIGINS.map((s) => (
            <option key={s} value={s} className="text-[var(--color-plonge-ink)]">
              {s}
            </option>
          ))}
        </select>
        <select
          value={draft.status}
          onChange={(e) => updateDraft({ status: e.target.value })}
          onBlur={finalizeBlur}
          aria-label="Status"
          className={`${selectClass} ${draft.status === '' ? 'text-zinc-500' : 'text-[var(--color-plonge-ink)]'}`}
        >
          <option value="" className="text-zinc-500">
            Status
          </option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s} className="text-[var(--color-plonge-ink)]">
              {s}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={draft.cvResumo}
        onChange={(e) => updateDraft({ cvResumo: e.target.value })}
        onBlur={finalizeBlur}
        placeholder="Resumo — trajetória e foco profissional."
        rows={6}
        spellCheck
        className={`${blockClass} min-h-[7.5rem]`}
        aria-label="Resumo profissional"
      />

      <textarea
        value={draft.cvExperiencia}
        onChange={(e) => updateDraft({ cvExperiencia: e.target.value })}
        onBlur={finalizeBlur}
        placeholder="Experiência — cargos, empresas e resultados."
        rows={10}
        spellCheck
        className={`${blockClass} min-h-[12rem]`}
        aria-label="Experiência profissional"
      />

      <textarea
        value={draft.cvFormacao}
        onChange={(e) => updateDraft({ cvFormacao: e.target.value })}
        onBlur={finalizeBlur}
        placeholder="Formação — cursos e diplomas."
        rows={4}
        spellCheck
        className={`${blockClass} min-h-[5rem]`}
        aria-label="Formação"
      />

      <textarea
        value={draft.cvCompetencias}
        onChange={(e) => updateDraft({ cvCompetencias: e.target.value })}
        onBlur={finalizeBlur}
        placeholder="Competências — separadas por vírgula ou uma por linha."
        rows={3}
        spellCheck
        className={`${blockClass} min-h-[4rem]`}
        aria-label="Competências"
      />
    </article>
  )
}
