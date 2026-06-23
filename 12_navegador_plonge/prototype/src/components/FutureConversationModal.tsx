import { X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  ConversationWithWhomField,
  type ConversationWithWhomFieldHandle,
  type FutureConversationParticipantEntry,
} from './ConversationWithWhomField'

export type { FutureConversationParticipantEntry }

export type FutureConversationPayload = {
  subject: string
  startLocal: string
  endLocal: string
  location: string
  notes: string
  participants: FutureConversationParticipantEntry[]
}

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

function toDatetimeLocalValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function defaultStartEnd() {
  const start = new Date()
  start.setMinutes(0, 0, 0)
  start.setHours(start.getHours() + 1)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  return { start, end }
}

const fieldClass =
  'w-full rounded-md border border-zinc-600 bg-zinc-950/90 px-2.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner focus:border-coral-500/60 focus:outline-none focus:ring-2 focus:ring-coral-500/25'

const labelClass = 'mb-1 block text-xs font-medium text-zinc-400'

type FutureConversationModalProps = {
  open: boolean
  onClose: () => void
  onSchedule?: (payload: FutureConversationPayload) => void
  /** Pré-seleciona um contato ao abrir (ex.: rota `/contact/:id`). */
  initialContactId?: string
}

export function FutureConversationModal({
  open,
  onClose,
  onSchedule,
  initialContactId,
}: FutureConversationModalProps) {
  const titleId = useId()
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const withWhomRef = useRef<ConversationWithWhomFieldHandle>(null)

  const [subject, setSubject] = useState('')
  const [startLocal, setStartLocal] = useState('')
  const [endLocal, setEndLocal] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open) return
    const { start, end } = defaultStartEnd()
    setSubject('')
    setStartLocal(toDatetimeLocalValue(start))
    setEndLocal(toDatetimeLocalValue(end))
    setLocation('')
    setNotes('')

    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, handleEscape])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!withWhomRef.current?.validate()) return
    const participants = withWhomRef.current.getParticipants()
    if (!participants?.length) return
    onSchedule?.({
      subject: subject.trim(),
      startLocal,
      endLocal,
      location: location.trim(),
      notes: notes.trim(),
      participants,
    })
    onClose()
  }

  if (!open) return null

  const node = (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,800px)] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-zinc-600/90 bg-zinc-900 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-700/80 bg-gradient-to-r from-zinc-800/90 to-zinc-900 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Convite · conversa agendada
            </p>
            <h2
              id={titleId}
              className="truncate text-base font-semibold text-[var(--color-plonge-ink)]"
            >
              Nova conversa futura
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Fechar diálogo"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
            <div>
              <label htmlFor="fc-subject" className={labelClass}>
                Assunto
              </label>
              <input
                ref={firstFieldRef}
                id="fc-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex.: Alinhamento trimestral — produto"
                className={fieldClass}
                autoComplete="off"
              />
            </div>

            <ConversationWithWhomField
              ref={withWhomRef}
              open={open}
              initialContactId={initialContactId}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fc-start" className={labelClass}>
                  Início
                </label>
                <input
                  id="fc-start"
                  type="datetime-local"
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="fc-end" className={labelClass}>
                  Fim
                </label>
                <input
                  id="fc-end"
                  type="datetime-local"
                  value={endLocal}
                  onChange={(e) => setEndLocal(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="fc-location" className={labelClass}>
                Local
              </label>
              <input
                id="fc-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sala, link Teams/Meet ou endereço"
                className={fieldClass}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="fc-notes" className={labelClass}>
                Mensagem para o convite
              </label>
              <textarea
                id="fc-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Texto do convite (como no corpo de um e-mail de reunião)."
                rows={4}
                className={`${fieldClass} resize-y leading-relaxed`}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-700/80 bg-zinc-950/50 px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-600"
            >
              Enviar convite
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
