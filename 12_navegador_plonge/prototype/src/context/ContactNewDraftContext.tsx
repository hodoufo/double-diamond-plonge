import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AutosaveStatus } from '../lib/autosaveStatus'
import { isConnectionDown } from '../lib/devConnection'
import {
  loadContactDraftNew,
  saveContactDraftNew,
  type ContactDraftFields,
} from '../lib/contactDraftStorage'

function validateDraft(f: ContactDraftFields): boolean {
  if (f.email.trim() === '') return true
  return f.email.includes('@')
}

export type ContactNewDraftContextValue = {
  draft: ContactDraftFields
  updateDraft: (patch: Partial<ContactDraftFields>) => void
  finalizeBlur: () => void
  /** Após toggle dev offline ou mudanças externas ao fluxo normal */
  revalidateStatus: () => void
  saveStatus: AutosaveStatus
}

const ContactNewDraftContext = createContext<ContactNewDraftContextValue | null>(
  null,
)

export function ContactNewDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ContactDraftFields>(() => loadContactDraftNew())
  const [saveStatus, setSaveStatus] = useState<AutosaveStatus>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const applyStatusAfterFlush = useCallback((next: ContactDraftFields) => {
    if (isConnectionDown()) {
      setSaveStatus('connection-error')
      return
    }
    setSaveStatus(validateDraft(next) ? 'saved' : 'validation-error')
  }, [])

  const flushSave = useCallback(
    (next: ContactDraftFields) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setSaveStatus('saving')
      saveContactDraftNew(next)
      debounceRef.current = setTimeout(() => {
        applyStatusAfterFlush(next)
      }, 400)
    },
    [applyStatusAfterFlush],
  )

  const updateDraft = useCallback(
    (patch: Partial<ContactDraftFields>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch }
        flushSave(next)
        return next
      })
    },
    [flushSave],
  )

  const finalizeBlur = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    setDraft((current) => {
      applyStatusAfterFlush(current)
      return current
    })
  }, [applyStatusAfterFlush])

  const revalidateStatus = useCallback(() => {
    setDraft((current) => {
      applyStatusAfterFlush(current)
      return current
    })
  }, [applyStatusAfterFlush])

  useEffect(() => {
    applyStatusAfterFlush(loadContactDraftNew())
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alinhamento inicial do farol ao montar
  }, [applyStatusAfterFlush])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    const onConnectivityChange = () => {
      setDraft((prev) => {
        applyStatusAfterFlush(prev)
        return prev
      })
    }
    window.addEventListener('online', onConnectivityChange)
    window.addEventListener('offline', onConnectivityChange)
    return () => {
      window.removeEventListener('online', onConnectivityChange)
      window.removeEventListener('offline', onConnectivityChange)
    }
  }, [applyStatusAfterFlush])

  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      finalizeBlur,
      revalidateStatus,
      saveStatus,
    }),
    [draft, updateDraft, finalizeBlur, revalidateStatus, saveStatus],
  )

  return (
    <ContactNewDraftContext.Provider value={value}>
      {children}
    </ContactNewDraftContext.Provider>
  )
}

export function useContactNewDraft(): ContactNewDraftContextValue {
  const ctx = useContext(ContactNewDraftContext)
  if (!ctx) {
    throw new Error('useContactNewDraft requires ContactNewDraftProvider')
  }
  return ctx
}
