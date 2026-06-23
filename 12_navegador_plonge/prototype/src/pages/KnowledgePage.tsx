import { FileText, Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import { SaveStatusBeacon } from '../components/SaveStatusBeacon'
import {
  DEFAULT_KB_DOC_ID,
  knowledgeDocuments,
  knowledgePathBreadcrumb,
} from '../data/mock'
import type { AutosaveStatus } from '../lib/autosaveStatus'
import { isConnectionDown } from '../lib/devConnection'
import {
  loadKnowledgeDocDraft,
  loadKnowledgeDraft,
  saveKnowledgeDocDraft,
  saveKnowledgeDraft,
  validateKnowledgeDraft,
  type KnowledgeDraft,
} from '../lib/knowledgeDraftStorage'

function docMatchesQuery(
  docId: string,
  doc: (typeof knowledgeDocuments)[string],
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return true

  const tokens = q.split(/\s+/).filter(Boolean)
  const hay = [
    docId,
    doc.title,
    doc.body,
    ...(doc.keywords ?? []),
    knowledgePathBreadcrumb(docId),
  ]
    .join('\n')
    .toLowerCase()

  return tokens.every((t) => hay.includes(t))
}

function loadMergedKnowledgeDraft(docId: string): KnowledgeDraft {
  const base = knowledgeDocuments[docId]
  const stored = loadKnowledgeDocDraft(docId)
  if (!stored) return { title: base.title, body: base.body }
  return stored
}

function WikiLinkChunk({ id }: { id: string }) {
  const target = knowledgeDocuments[id]
  const label = target?.title ?? id
  return (
    <Link
      to={`/kb/${encodeURIComponent(id)}`}
      className="font-medium text-coral-400 underline decoration-coral-500/50 underline-offset-2 hover:text-coral-300"
    >
      {label}
    </Link>
  )
}

function WikiLinkSummary({ body }: { body: string }) {
  const ids = useMemo(() => {
    const re = /\[\[([^\]]+)\]\]/g
    const out: string[] = []
    let m: RegExpExecArray | null
    while ((m = re.exec(body)) !== null) {
      const id = m[1]!.trim()
      if (id && !out.includes(id)) out.push(id)
    }
    return out
  }, [body])

  if (ids.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
      <span className="shrink-0 font-medium text-zinc-400">Ligações nesta página</span>
      <span className="hidden sm:inline" aria-hidden>
        —
      </span>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {ids.map((id) => (
          <li key={id}>
            <WikiLinkChunk id={id} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedChips({ ids }: { ids: string[] }) {
  return (
    <ul className="mt-1 flex flex-wrap gap-1.5">
      {ids.map((rid) => {
        const d = knowledgeDocuments[rid]
        if (!d) return null
        return (
          <li key={rid}>
            <Link
              to={`/kb/${encodeURIComponent(rid)}`}
              className="inline-flex max-w-full rounded-full border border-zinc-600 bg-zinc-900/80 px-2.5 py-0.5 text-xs font-medium text-coral-200/95 hover:border-coral-500/50 hover:bg-zinc-800"
            >
              <span className="truncate">{d.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const kbBodyEditorClass = [
  'mt-4 min-h-[min(60vh,32rem)] w-full resize-y border-0 bg-transparent p-0',
  'text-sm leading-relaxed text-zinc-300 placeholder:text-zinc-500/65',
  'caret-[var(--color-plonge-ink)] outline-none focus:ring-0 focus-visible:ring-0',
  'selection:bg-coral-600/25',
].join(' ')

export function KnowledgePage() {
  const navigate = useNavigate()
  const newRouteMatch = useMatch('/kb/new')
  const { docId: docIdParam } = useParams<{ docId: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [kbDraft, setKbDraft] = useState<KnowledgeDraft>({ title: '', body: '' })
  const [kbSaveStatus, setKbSaveStatus] = useState<AutosaveStatus>('saved')
  const kbSaveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)
  const motherDocPickerRef = useRef<HTMLDivElement>(null)

  const [motherDocQuery, setMotherDocQuery] = useState('')
  const [motherDocPickerOpen, setMotherDocPickerOpen] = useState(false)

  const isNewDocument = Boolean(newRouteMatch)

  const activeDocId = isNewDocument
    ? null
    : docIdParam != null && Object.hasOwn(knowledgeDocuments, docIdParam)
      ? docIdParam
      : DEFAULT_KB_DOC_ID

  const doc = activeDocId != null ? knowledgeDocuments[activeDocId] : null

  const persistKb = useCallback(
    (d: KnowledgeDraft) => {
      if (isNewDocument) saveKnowledgeDraft(d)
      else if (activeDocId != null) saveKnowledgeDocDraft(activeDocId, d)
    },
    [isNewDocument, activeDocId],
  )

  const applyStatusAfterFlush = useCallback((next: KnowledgeDraft) => {
    if (isConnectionDown()) {
      setKbSaveStatus('connection-error')
      return
    }
    setKbSaveStatus(validateKnowledgeDraft(next) ? 'saved' : 'validation-error')
  }, [])

  const flushKbSave = useCallback(
    (next: KnowledgeDraft) => {
      if (kbSaveDebounceRef.current) clearTimeout(kbSaveDebounceRef.current)
      setKbSaveStatus('saving')
      persistKb(next)
      kbSaveDebounceRef.current = setTimeout(() => {
        applyStatusAfterFlush(next)
      }, 400)
    },
    [applyStatusAfterFlush, persistKb],
  )

  const finalizeKbBlur = useCallback(() => {
    if (kbSaveDebounceRef.current) {
      clearTimeout(kbSaveDebounceRef.current)
      kbSaveDebounceRef.current = null
    }
    setKbDraft((current) => {
      applyStatusAfterFlush(current)
      return current
    })
  }, [applyStatusAfterFlush])

  useEffect(() => {
    return () => {
      if (kbSaveDebounceRef.current) clearTimeout(kbSaveDebounceRef.current)
    }
  }, [])

  /** Carrega rascunho ao mudar rota e alinha o farol (remount não cobre leitura de localStorage). */
  /* eslint-disable react-hooks/set-state-in-effect -- hidratação ao trocar entre `/kb/new` e `/kb/:docId` */
  useEffect(() => {
    if (isNewDocument) {
      const d = loadKnowledgeDraft()
      setKbDraft(d)
      applyStatusAfterFlush(d)
      return
    }
    if (activeDocId != null) {
      const d = loadMergedKnowledgeDraft(activeDocId)
      setKbDraft(d)
      applyStatusAfterFlush(d)
    }
  }, [isNewDocument, activeDocId, applyStatusAfterFlush])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const onConnectivityChange = () => {
      setKbDraft((prev) => {
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

  useEffect(() => {
    if (isNewDocument) return
    if (docIdParam == null) return
    if (!Object.hasOwn(knowledgeDocuments, docIdParam)) {
      navigate({ pathname: '/kb' }, { replace: true })
    }
  }, [isNewDocument, docIdParam, navigate])

  const motherDocCandidates = useMemo(() => {
    return Object.entries(knowledgeDocuments)
      .filter(([id]) => id !== activeDocId)
      .filter(([id, d]) => docMatchesQuery(id, d, motherDocQuery))
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 12)
  }, [activeDocId, motherDocQuery])

  useEffect(() => {
    if (!motherDocPickerOpen) return
    const onDown = (e: MouseEvent) => {
      if (!motherDocPickerRef.current?.contains(e.target as Node)) {
        setMotherDocPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [motherDocPickerOpen])

  useEffect(() => {
    setMotherDocQuery('')
    setMotherDocPickerOpen(false)
  }, [activeDocId, isNewDocument])

  const handleKbDraftChange = useCallback(
    (patch: Partial<KnowledgeDraft>) => {
      setKbDraft((prev) => {
        const next = { ...prev, ...patch }
        flushKbSave(next)
        return next
      })
    },
    [flushKbSave],
  )

  const insertInternalPageLink = useCallback(
    (targetDocId: string) => {
      const ta = bodyTextareaRef.current
      const ins = ` [[${targetDocId}]]`
      if (!ta) {
        handleKbDraftChange({ body: kbDraft.body + ins })
        return
      }
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const v = kbDraft.body
      const nextBody = v.slice(0, start) + ins + v.slice(end)
      handleKbDraftChange({ body: nextBody })
      const caret = start + ins.length
      requestAnimationFrame(() => {
        ta.setSelectionRange(caret, caret)
        ta.focus()
      })
    },
    [handleKbDraftChange, kbDraft.body],
  )

  const goToNew = () => {
    navigate({ pathname: '/kb/new' })
  }

  const selectFile = (id: string) => {
    navigate({ pathname: `/kb/${encodeURIComponent(id)}` })
  }

  const docList = useMemo(() => {
    const entries = Object.entries(knowledgeDocuments)
    const filtered = entries.filter(([id, d]) => docMatchesQuery(id, d, searchQuery))
    filtered.sort(([a], [b]) => a.localeCompare(b))
    return filtered
  }, [searchQuery])

  const slugLabel = isNewDocument ? 'novo' : activeDocId ?? ''
  const titleFieldId = isNewDocument
    ? 'knowledge-new-title'
    : `knowledge-doc-title-${activeDocId ?? 'default'}`
  const bodyFieldId = isNewDocument
    ? 'knowledge-new-body'
    : `knowledge-doc-body-${activeDocId ?? 'default'}`

  const parentDoc =
    doc?.parentId != null ? knowledgeDocuments[doc.parentId] : undefined

  const editorCard =
    isNewDocument || doc ? (
      <article
        key={isNewDocument ? 'new' : activeDocId ?? 'doc'}
        className="min-h-[320px] rounded-xl border border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)] p-6 shadow-sm"
      >
        <div className="-mx-6 -mt-6 mb-4 flex h-10 shrink-0 items-center justify-between gap-2 border-b border-zinc-700/90 bg-zinc-950/60 px-6">
          <span className="min-w-0 truncate font-mono text-[10px] text-zinc-500">
            {slugLabel}
          </span>
          <SaveStatusBeacon
            status={kbSaveStatus}
            onActivate={() => {
              titleInputRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
              titleInputRef.current?.focus({ preventScroll: true })
            }}
          />
        </div>

        <label className="sr-only" htmlFor={titleFieldId}>
          Título
        </label>
        <input
          ref={titleInputRef}
          id={titleFieldId}
          type="text"
          value={kbDraft.title}
          onChange={(e) => handleKbDraftChange({ title: e.target.value })}
          onBlur={finalizeKbBlur}
          placeholder="Sem título"
          autoComplete="off"
          className="w-full border-0 bg-transparent text-lg font-semibold text-[var(--color-plonge-ink)] placeholder:text-zinc-500 focus:outline-none focus:ring-0"
        />

        {!isNewDocument && doc?.parentId && parentDoc ? (
          <p className="mt-3 text-sm text-zinc-400">
            <span className="text-zinc-500">Pai: </span>
            <Link
              to={`/kb/${encodeURIComponent(doc.parentId)}`}
              className="inline-flex max-w-full rounded-full border border-zinc-600 bg-zinc-900/80 px-2.5 py-0.5 text-xs font-medium text-coral-200/95 hover:border-coral-500/50 hover:bg-zinc-800"
            >
              <span className="truncate">{parentDoc.title}</span>
            </Link>
          </p>
        ) : null}

        {!isNewDocument && (doc?.relatedIds?.length ?? 0) > 0 && doc ? (
          <div className="mt-3">
            <p className="text-sm text-zinc-500">Relacionados:</p>
            <RelatedChips ids={doc.relatedIds ?? []} />
          </div>
        ) : null}

        <label className="sr-only" htmlFor={bodyFieldId}>
          Conteúdo da página
        </label>

        <div
          ref={motherDocPickerRef}
          className="relative mt-4 border-b border-zinc-700/40 pb-3"
        >
          <label htmlFor="kb-mother-doc-search" className="text-xs text-zinc-500">
            Documento mãe
          </label>
          <div className="relative mt-1.5 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={2}
              aria-hidden
            />
            <input
              id="kb-mother-doc-search"
              type="search"
              value={motherDocQuery}
              onChange={(e) => setMotherDocQuery(e.target.value)}
              onFocus={() => setMotherDocPickerOpen(true)}
              placeholder="Pesquisar documento…"
              autoComplete="off"
              className={[
                'w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 shadow-inner',
                'placeholder:text-zinc-500',
                'focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/25',
              ].join(' ')}
              aria-autocomplete="list"
              aria-expanded={motherDocPickerOpen}
              aria-controls="kb-mother-doc-results"
            />
            {motherDocPickerOpen ? (
              <ul
                id="kb-mother-doc-results"
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-20 max-h-52 overflow-y-auto rounded-lg border border-zinc-600 bg-zinc-950 py-1 shadow-lg ring-1 ring-black/40"
              >
                {motherDocCandidates.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-zinc-500">
                    Nenhum documento corresponde à pesquisa.
                  </li>
                ) : (
                  motherDocCandidates.map(([id, d]) => (
                    <li key={id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/90 focus:bg-zinc-800/90 focus:outline-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          insertInternalPageLink(id)
                          setMotherDocQuery('')
                          setMotherDocPickerOpen(false)
                        }}
                      >
                        <span className="font-medium leading-snug">{d.title}</span>
                        <span className="truncate font-mono text-[11px] text-zinc-500">
                          {knowledgePathBreadcrumb(id)}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        </div>

        <textarea
          ref={bodyTextareaRef}
          id={bodyFieldId}
          value={kbDraft.body}
          onChange={(e) => handleKbDraftChange({ body: e.target.value })}
          onBlur={finalizeKbBlur}
          placeholder="Comece a escrever o texto da página aqui…"
          spellCheck
          rows={14}
          className={kbBodyEditorClass}
        />

        <WikiLinkSummary body={kbDraft.body} />

        <p className="mt-3 text-[11px] leading-snug text-zinc-600">
          Escreve direto no campo; não é preciso formato especial. As ligações escolhidas na
          pesquisa acima aparecem também na linha «Ligações nesta página».
        </p>
      </article>
    ) : null

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-plonge-ink)]">
          Conhecimento
        </h1>
        <p className="text-sm text-[var(--color-plonge-muted)]">
          Escreva direto na página; não é necessário usar Markdown. Em «Documento mãe», pesquise
          e escolha para inserir uma ligação a outra página.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-0">
        <aside
          className={[
            'flex max-h-52 shrink-0 flex-col gap-2 overflow-hidden rounded-xl border border-[var(--color-plonge-border)]',
            'bg-[var(--color-plonge-card)] p-3 shadow-sm',
            'md:sticky md:top-2 md:mr-4 md:w-72 md:max-h-[min(480px,calc(100dvh-10rem))] md:self-start',
          ].join(' ')}
          aria-label="Buscar e listar documentos"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palavra…"
              autoComplete="off"
              className={[
                'w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 shadow-inner',
                'placeholder:text-zinc-500',
                'focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/25',
              ].join(' ')}
              aria-label="Filtrar documentos"
            />
          </div>
          <nav
            className="min-h-0 flex-1 overflow-y-auto text-sm"
            aria-label="Lista de documentos"
          >
            <ul className="space-y-0.5 pr-1">
              <li>
                <button
                  type="button"
                  onClick={goToNew}
                  className={[
                    'flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left transition-colors',
                    isNewDocument
                      ? 'bg-[var(--color-plonge-accent-soft)] text-coral-200'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-[var(--color-plonge-ink)]',
                  ].join(' ')}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Plus className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
                    <span className="min-w-0 truncate font-medium">Novo documento</span>
                  </span>
                  <span className="truncate pl-6 font-mono text-[11px] text-zinc-500">
                    Rascunho local
                  </span>
                </button>
              </li>
              {docList.map(([id, item]) => {
                const active = !isNewDocument && activeDocId === id
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => selectFile(id)}
                      className={[
                        'flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left transition-colors',
                        active
                          ? 'bg-[var(--color-plonge-accent-soft)] text-coral-200'
                          : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-[var(--color-plonge-ink)]',
                      ].join(' ')}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
                        <span className="min-w-0 truncate font-medium">{item.title}</span>
                      </span>
                      <span className="truncate pl-6 font-mono text-[11px] text-zinc-500">
                        {knowledgePathBreadcrumb(id)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {docList.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-zinc-500">
                Nenhum documento corresponde à busca.
              </p>
            ) : null}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{editorCard}</div>
      </div>
    </div>
  )
}
