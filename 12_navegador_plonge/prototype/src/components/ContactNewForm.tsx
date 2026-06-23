import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { useContactNewDraft } from '../context/ContactNewDraftContext'
import { DEV_OFFLINE_KEY, isConnectionDown } from '../lib/devConnection'

export type ContactAutosaveStatus =
  | 'saved'
  | 'saving'
  | 'validation-error'
  | 'connection-error'

export type ContactNewFormHandle = {
  /** Rola até o e-mail inválido e aplica destaque temporário */
  highlightInvalidEmail: () => void
}

function syncEmptyClass(el: HTMLDivElement) {
  const t = el.innerText.replace(/\n/g, '').trim()
  el.classList.toggle('contact-editable-empty', t === '')
}

type EditableLineProps = {
  initialText: string
  placeholder: string
  ariaLabel: string
  inputMode?: HTMLAttributes<HTMLDivElement>['inputMode']
  fieldRef?: RefObject<HTMLDivElement | null>
  pulse?: boolean
  onTextChange: (value: string) => void
  onAfterBlur: () => void
}

function ContactEditableLine({
  initialText,
  placeholder,
  ariaLabel,
  inputMode,
  fieldRef,
  pulse,
  onTextChange,
  onAfterBlur,
}: EditableLineProps) {
  const localRef = useRef<HTMLDivElement>(null)
  const ref = fieldRef ?? localRef
  const didInit = useRef(false)
  const initialRef = useRef(initialText)
  initialRef.current = initialText

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || didInit.current) return
    el.textContent = initialRef.current
    syncEmptyClass(el)
    didInit.current = true
  }, [ref])

  const handleInput = () => {
    const el = ref.current
    if (!el) return
    const normalized = el.innerText.replace(/\r\n/g, '\n').replace(/\n/g, '')
    if (el.innerText !== normalized) {
      el.textContent = normalized
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(el)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    syncEmptyClass(el)
    onTextChange(normalized)
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData
      .getData('text/plain')
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, ' ')
    document.execCommand('insertText', false, text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <div
      ref={ref}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      aria-label={ariaLabel}
      aria-multiline={false}
      data-placeholder={placeholder}
      inputMode={inputMode}
      spellCheck
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onBlur={onAfterBlur}
      className={`contact-editable-field w-full border-0 border-b bg-transparent py-1.5 text-sm leading-snug text-[var(--color-plonge-ink)] outline-none transition-[box-shadow] focus:border-b focus:border-zinc-600/80 focus:ring-0 focus-visible:ring-1 focus-visible:ring-coral-500/30 ${
        pulse
          ? 'border-red-500/90 ring-2 ring-red-500/65 ring-offset-2 ring-offset-zinc-950'
          : 'border-zinc-700/50'
      }`}
    />
  )
}

export const ContactNewForm = forwardRef<ContactNewFormHandle>(
  function ContactNewForm(_, ref) {
    const { draft, updateDraft, finalizeBlur, revalidateStatus } = useContactNewDraft()
    const [devSimulateOffline, setDevSimulateOffline] = useState(() => {
      if (typeof window === 'undefined') return false
      try {
        return window.localStorage.getItem(DEV_OFFLINE_KEY) === '1'
      } catch {
        return false
      }
    })
    const [emailPulse, setEmailPulse] = useState(false)
    const emailEditableRef = useRef<HTMLDivElement>(null)
    const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        highlightInvalidEmail: () => {
          const el = emailEditableRef.current
          if (!el) return
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus({ preventScroll: true })
          setEmailPulse(true)
          if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
          pulseTimerRef.current = setTimeout(() => setEmailPulse(false), 2200)
        },
      }),
      [],
    )

    useEffect(() => {
      return () => {
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
      }
    }, [])

    const commit =
      (key: 'name' | 'email' | 'phone') => (value: string) => {
        updateDraft({ [key]: value })
      }

    const toggleDevOffline = () => {
      setDevSimulateOffline((prev) => {
        const next = !prev
        try {
          if (next) window.localStorage.setItem(DEV_OFFLINE_KEY, '1')
          else window.localStorage.removeItem(DEV_OFFLINE_KEY)
        } catch {
          /* ignore */
        }
        queueMicrotask(() => {
          revalidateStatus()
        })
        return next
      })
    }

    const offlineHint =
      devSimulateOffline || isConnectionDown() ? ' (simulado)' : ''

    return (
    <>
      <div className="space-y-0 text-sm">
        <ContactEditableLine
          initialText={draft.name}
          placeholder="Nome ou como prefere ser chamado(a)"
          ariaLabel="Nome"
          onTextChange={commit('name')}
          onAfterBlur={finalizeBlur}
        />
        <ContactEditableLine
          fieldRef={emailEditableRef}
          pulse={emailPulse}
          initialText={draft.email}
          placeholder="E-mail"
          ariaLabel="E-mail"
          inputMode="email"
          onTextChange={commit('email')}
          onAfterBlur={finalizeBlur}
        />
        <ContactEditableLine
          initialText={draft.phone}
          placeholder="Telefone"
          ariaLabel="Telefone"
          inputMode="tel"
          onTextChange={commit('phone')}
          onAfterBlur={finalizeBlur}
        />
      </div>
      <p className="mt-5 text-[10px] leading-snug text-zinc-600">
        Currículo (resumo, experiência, formação) na superfície principal — também fica neste
        navegador até sincronizar.
      </p>
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-[10px] text-zinc-500">
        <input
          type="checkbox"
          checked={devSimulateOffline}
          onChange={toggleDevOffline}
          className="rounded border-zinc-600 bg-zinc-900 text-coral-500 focus:ring-coral-500/50"
        />
        <span>Dev: simular sem conexão{offlineHint}</span>
      </label>
      </>
    )
  },
)
