import type { ReactNode } from 'react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, Link2, X } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  ContactNewForm,
  type ContactAutosaveStatus,
  type ContactNewFormHandle,
} from '../components/ContactNewForm'
import { useDetailPanel } from '../context/useDetailPanel'
import { useRegisterDetailPanelCloseBlock } from '../context/useRegisterDetailPanelCloseBlock'
import { useContactNewDraft } from '../context/ContactNewDraftContext'
import { CompanyPeopleSidebarField } from '../components/CompanyPeopleSidebarField'
import { ConversationMetadataSidebar } from '../components/ConversationMetadataSidebar'
import {
  candidates,
  commercialPipeSourceLabel,
  commercialPipeStages,
  companies,
  contacts,
  deals,
  dealsInPipeStage,
  getTasksByContactId,
  getTasksByDealId,
  getTasksByProjectId,
  knowledgePage,
  getRunningProjectById,
  projectPipeline,
  runningProjects,
  upcomingTasks,
  type UpcomingTask,
} from '../data/mock'
import {
  getDetailPanelTitle,
  parseDetailKey,
  stripLeadingStageIndex,
} from '../lib/detailShare'
import {
  getDealWithSessionOverrides,
  saveDealSessionOverrides,
} from '../lib/dealSessionStorage'

/** Duração da animação de slide (deve bater com Tailwind `duration-*`) */
const PANEL_TRANSITION_MS = 300

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Contatos sugeridos para o painel (mesma empresa e/ou mesma temperatura). */
function similarContactsForDetail(excludeId: string, limit = 4) {
  const self = contacts.find((c) => c.id === excludeId)
  if (!self) return []

  return contacts
    .filter((c) => c.id !== excludeId)
    .map((c) => ({
      contact: c,
      score:
        (c.company === self.company ? 3 : 0) +
        (c.relation === self.relation ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || a.contact.name.localeCompare(b.contact.name),
    )
    .slice(0, limit)
    .map(({ contact }) => contact)
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </div>
      <div className="text-sm text-[var(--color-plonge-ink)]">{children}</div>
    </div>
  )
}

const dealFieldInputClass =
  'mt-1 w-full rounded-md border border-zinc-600 bg-zinc-900/80 px-2 py-1.5 text-sm text-zinc-200 focus:border-coral-500/50 focus:outline-none focus:ring-1 focus:ring-coral-500/40'

/** Lista de tarefas no painel (deal/contato) — abre detalhe `task:…`. */
function DetailPanelTaskList({
  tasks,
  emptyMessage,
}: {
  tasks: UpcomingTask[]
  emptyMessage: string
}) {
  const { openDetailPanel } = useDetailPanel()
  if (tasks.length === 0) {
    return <p className="text-sm text-zinc-400">{emptyMessage}</p>
  }
  return (
    <ul className="divide-y divide-zinc-700/60 rounded-lg border border-zinc-700/60 bg-zinc-950/40">
      {tasks.map((t) => (
        <li key={t.id} className="first:rounded-t-lg last:rounded-b-lg">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-zinc-800/35 focus-visible:outline focus-visible:ring-2 focus-visible:ring-coral-500/45"
            onClick={() => openDetailPanel({ detail: `task:${t.id}` })}
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
          </button>
        </li>
      ))}
    </ul>
  )
}

function DealDetailForm({ dealId }: { dealId: string }) {
  const isNew = dealId === 'new'
  const d = useMemo(
    () => (isNew ? undefined : deals.find((x) => x.id === dealId)),
    [isNew, dealId],
  )

  const companySelectId = useId()
  const peopleLegendId = useId()
  const nameInputId = useId()
  const stageInputId = useId()
  const valueInputId = useId()
  const probInputId = useId()
  const funnelSelectId = useId()
  const valueExistingInputId = useId()
  const probExistingInputId = useId()

  const [dealName, setDealName] = useState('')
  const [stage, setStage] = useState('')
  const [valueK, setValueK] = useState('')
  const [probStr, setProbStr] = useState('')
  const [pipeStageId, setPipeStageId] = useState('')

  const [companyId, setCompanyId] = useState('')
  const [contactIds, setContactIds] = useState<string[]>([])

  useEffect(() => {
    if (isNew) {
      setDealName('')
      setStage('')
      setValueK('')
      setProbStr('')
      setPipeStageId('')
      setCompanyId('')
      setContactIds([])
      return
    }
    const m = getDealWithSessionOverrides(dealId)
    if (!m) return
    setDealName(m.name)
    setStage(m.stage)
    setValueK(String(Math.round(m.value / 1000)))
    setProbStr(String(m.prob))
    setPipeStageId(m.pipeStageId)
    setCompanyId(m.companyId ?? '')
    setContactIds([...(m.contactIds ?? [])])
  }, [isNew, dealId])

  useEffect(() => {
    if (isNew || !dealId) return
    const t = window.setTimeout(() => {
      const m = getDealWithSessionOverrides(dealId)
      if (!m) return
      const vk = parseFloat(String(valueK).replace(',', '.'))
      const val = Number.isFinite(vk) ? Math.round(vk * 1000) : m.value
      const pi = parseInt(probStr, 10)
      const prob = Number.isFinite(pi)
        ? Math.min(100, Math.max(0, pi))
        : m.prob
      if (val !== m.value || prob !== m.prob) {
        saveDealSessionOverrides(dealId, { value: val, prob })
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [isNew, dealId, valueK, probStr])

  const toggleContact = (id: string) => {
    setContactIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const resolved = !isNew && dealId ? getDealWithSessionOverrides(dealId) : undefined

  const dealTasks = useMemo(
    () => (!isNew && dealId ? getTasksByDealId(dealId) : []),
    [isNew, dealId],
  )

  if (!isNew && !resolved && !d) return null

  return (
    <>
      <Card title={isNew ? 'Novo negócio' : 'Negócio'}>
        {isNew ? (
          <div className="space-y-3">
            <div>
              <label htmlFor={nameInputId} className="text-xs font-medium text-zinc-500">
                Nome do negócio
              </label>
              <input
                id={nameInputId}
                type="text"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                placeholder="Ex.: Aurora — Eng. Sênior"
                className={dealFieldInputClass}
              />
            </div>
            <div>
              <label htmlFor={stageInputId} className="text-xs font-medium text-zinc-500">
                Estágio
              </label>
              <input
                id={stageInputId}
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder="Qualificação, Proposta…"
                className={dealFieldInputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={valueInputId} className="text-xs font-medium text-zinc-500">
                  Valor (R$ k)
                </label>
                <input
                  id={valueInputId}
                  inputMode="decimal"
                  type="text"
                  value={valueK}
                  onChange={(e) => setValueK(e.target.value)}
                  placeholder="180"
                  className={dealFieldInputClass}
                />
              </div>
              <div>
                <label htmlFor={probInputId} className="text-xs font-medium text-zinc-500">
                  Prob. (%)
                </label>
                <input
                  id={probInputId}
                  inputMode="numeric"
                  type="text"
                  value={probStr}
                  onChange={(e) => setProbStr(e.target.value)}
                  placeholder="60"
                  className={dealFieldInputClass}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold">{(resolved ?? d)!.name}</p>
            <div>
              <label htmlFor={funnelSelectId} className="text-xs font-medium text-zinc-500">
                Etapa do funil
              </label>
              <select
                id={funnelSelectId}
                className={dealFieldInputClass}
                value={pipeStageId}
                onChange={(e) => {
                  const id = e.target.value
                  const st = commercialPipeStages.find((s) => s.id === id)
                  const stageText = st ? stripLeadingStageIndex(st.title) : stage
                  setPipeStageId(id)
                  setStage(stageText)
                  saveDealSessionOverrides(dealId, {
                    pipeStageId: id,
                    stage: stageText,
                  })
                }}
              >
                {commercialPipeStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {stripLeadingStageIndex(s.title)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={valueExistingInputId} className="text-xs font-medium text-zinc-500">
                  Valor (R$ k)
                </label>
                <input
                  id={valueExistingInputId}
                  inputMode="decimal"
                  type="text"
                  value={valueK}
                  onChange={(e) => setValueK(e.target.value)}
                  placeholder="180"
                  className={dealFieldInputClass}
                />
              </div>
              <div>
                <label htmlFor={probExistingInputId} className="text-xs font-medium text-zinc-500">
                  Prob. (%)
                </label>
                <input
                  id={probExistingInputId}
                  inputMode="numeric"
                  type="text"
                  value={probStr}
                  onChange={(e) => setProbStr(e.target.value)}
                  placeholder="60"
                  className={dealFieldInputClass}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
      <Card title="Relacionamentos">
        <div>
          <label htmlFor={companySelectId} className="text-xs font-medium text-zinc-500">
            Empresa
          </label>
          <select
            id={companySelectId}
            className={dealFieldInputClass}
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Selecione uma empresa…</option>
            {companies.map((co) => (
              <option key={co.id} value={co.id}>
                {co.name}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="mt-4 border-0 p-0">
          <legend id={peopleLegendId} className="text-xs font-medium text-zinc-500">
            Pessoas
          </legend>
          <div
            className="mt-2 max-h-36 space-y-2 overflow-y-auto rounded-lg border border-zinc-700/60 bg-zinc-950/50 p-2"
            role="group"
            aria-labelledby={peopleLegendId}
          >
            {contacts.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-2 text-sm leading-snug text-zinc-300"
              >
                <input
                  type="checkbox"
                  checked={contactIds.includes(c.id)}
                  onChange={() => toggleContact(c.id)}
                  className="mt-0.5 shrink-0 rounded border-zinc-600 bg-zinc-900 text-coral-500 focus:ring-coral-500/50"
                />
                <span>
                  <span className="font-medium text-zinc-200">{c.name}</span>
                  <span className="block text-[11px] text-zinc-500">
                    {c.role} · {c.company}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </Card>
      <Card title="Próximos passos">
        {isNew ? (
          <p className="text-sm text-zinc-400">
            Defina empresa e pessoas; após criar o negócio, as tarefas podem ser associadas (mock).
          </p>
        ) : (
          <DetailPanelTaskList
            tasks={dealTasks}
            emptyMessage="Nenhuma tarefa associada a este negócio no protótipo."
          />
        )}
      </Card>
    </>
  )
}

function renderByDetailKey(
  detailKey: string | null,
  opts?: { initialConversationCompanyId?: string | null },
): ReactNode | null {
  if (!detailKey) return null
  const p = parseDetailKey(detailKey)
  if (!p) return null

  switch (p.kind) {
    case 'task': {
      const t = upcomingTasks.find((x) => x.id === p.id)
      if (!t) return null
      return (
        <>
          <Card title="Tarefa">
            <p className="font-semibold">{t.title}</p>
            <p className="mt-2 text-zinc-400">Prazo: {t.due}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Status: {t.done ? 'Concluída' : 'Pendente'}
            </p>
          </Card>
          <Card title="Próximo passo">
            <p className="text-zinc-400">Abrir na lista central ou marcar como feita.</p>
          </Card>
        </>
      )
    }
    case 'project': {
      const pr = getRunningProjectById(p.id)
      if (!pr) return null
      return (
        <>
          <Card title="Identificação">
            <p className="font-semibold">{pr.name}</p>
            <p className="mt-1 text-xs text-zinc-500">ID: {pr.id}</p>
          </Card>
          <Card title="Cliente">
            <p>{pr.client}</p>
          </Card>
          <Card title="Datas">
            <p>
              Início: <span className="text-zinc-300">{pr.dataInicio}</span>
            </p>
            <p className="mt-1">
              Término previsto: <span className="text-zinc-300">{pr.dataFimPrevista}</span>
            </p>
          </Card>
          <Card title="Responsável comercial">
            <p>{pr.owner}</p>
          </Card>
          <Card title="Orçamento">
            <p className="text-zinc-400">{pr.orcamentoPlaceholder}</p>
            <p className="mt-2 text-xs text-zinc-500">Valor contratual integrado em breve.</p>
          </Card>
          <Card title="Recrutamento (ATS)">
            <p className="text-xs font-medium text-coral-300">Etapa atual: {pr.stage}</p>
            <p className="mt-1 text-xs text-zinc-500">
              O ciclo de entrega está na área principal.
            </p>
          </Card>
          <Card title="Próximos passos">
            <DetailPanelTaskList
              tasks={getTasksByProjectId(pr.id)}
              emptyMessage="Nenhuma tarefa associada a este projeto no protótipo."
            />
          </Card>
        </>
      )
    }
    case 'stage': {
      const s = commercialPipeStages.find((x) => x.id === p.id)
      if (!s) return null
      const inStage = dealsInPipeStage(p.id)
      return (
        <>
          <Card title="Etapa do pipe">
            <p className="font-semibold">{stripLeadingStageIndex(s.title)}</p>
            <p className="mt-1 text-zinc-400">
              Origem: {commercialPipeSourceLabel(s.source)}
            </p>
            <p className="mt-2 text-sm tabular-nums text-zinc-300">{s.count} negócios</p>
          </Card>
          <Card title="Negócios nesta etapa">
            {inStage.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum negócio deste protótipo nesta etapa — os números do funil são agregados.
              </p>
            ) : (
              <ul className="max-h-[min(55vh,22rem)] space-y-0 overflow-y-auto rounded-lg border border-zinc-700/80 divide-y divide-zinc-700/80">
                {inStage.map((d) => {
                  const co = d.companyId
                    ? companies.find((c) => c.id === d.companyId)
                    : undefined
                  return (
                    <li key={d.id}>
                      <Link
                        to={`/deals/${d.id}`}
                        className="flex items-start gap-2 px-2.5 py-2.5 text-left transition-colors hover:bg-zinc-800/60 focus-visible:outline focus-visible:ring-2 focus-visible:ring-coral-500/45"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-100">{d.name}</p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {d.stage} · R${' '}
                            {(d.value / 1000).toFixed(0)}k · {d.prob}% prob.
                            {co ? ` · ${co.name}` : ''}
                          </p>
                        </div>
                        <ChevronRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600"
                          aria-hidden
                          strokeWidth={2}
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <p className="mt-3 text-[11px] leading-snug text-zinc-600">
              Toque num negócio para abrir o detalhe na área principal e no painel.
            </p>
          </Card>
        </>
      )
    }
    case 'contact': {
      if (p.id === 'new') return null
      const c = contacts.find((x) => x.id === p.id)
      if (!c) return null
      const resumoPreview = c.curriculum.resumo[0] ?? ''
      const parecidas = similarContactsForDetail(c.id)
      return (
        <>
          <Card title="Pessoa">
            <p className="font-semibold">{c.name}</p>
            <p className="text-zinc-400">
              {c.role} · {c.company}
            </p>
            <p className="mt-2 text-xs text-coral-400">Relação: {c.relation}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
              <dt className="text-zinc-500">Estratégia</dt>
              <dd className="text-zinc-200">{c.estrategia}</dd>
              <dt className="text-zinc-500">Origem</dt>
              <dd className="text-zinc-200">{c.origem}</dd>
              <dt className="text-zinc-500">Status</dt>
              <dd className="text-zinc-200">{c.status}</dd>
            </dl>
          </Card>
          {resumoPreview ? (
            <Card title="Resumo">
              <p className="line-clamp-5 text-sm leading-relaxed text-zinc-400">{resumoPreview}</p>
              <p className="mt-2 text-[11px] text-zinc-500">
                Currículo completo na área principal.
              </p>
            </Card>
          ) : null}
          <Card title="Integrações (mock)">
            <p>Lusha · WhatsApp · Tarefas</p>
          </Card>
          <Card title="Próximos passos">
            <DetailPanelTaskList
              tasks={getTasksByContactId(c.id)}
              emptyMessage="Nenhuma tarefa associada a este contato no protótipo."
            />
          </Card>
          {parecidas.length > 0 ? (
            <Card title="Pessoas parecidas">
              <ul className="space-y-3">
                {parecidas.map((pc) => (
                  <li key={pc.id}>
                    <Link
                      to={`/contact/${pc.id}`}
                      className="block rounded-lg py-0.5 transition-colors hover:bg-zinc-800/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-coral-500/40"
                    >
                      <span className="text-sm font-medium text-zinc-200">
                        {pc.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500">
                        {pc.role} · {pc.company}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </>
      )
    }
    case 'deal': {
      return <DealDetailForm key={p.id} dealId={p.id} />
    }
    case 'candidate': {
      const a = candidates.find((x) => x.id === p.id)
      if (!a) return null
      return (
        <>
          <Card title="Candidato">
            <p className="font-medium">{a.name}</p>
            <p className="text-zinc-400">
              {a.role} · {a.project}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Status: {a.status}</p>
          </Card>
          <Card title="ATS">
            <p className="text-zinc-400">Triagem e entrevistas no projeto.</p>
          </Card>
        </>
      )
    }
    case 'pipeline': {
      const s = projectPipeline.find((x) => x.id === p.id)
      if (!s) return null
      return (
        <>
          <Card title="Etapa ATS">
            <p className="font-semibold">{s.name}</p>
            <p className="mt-2 tabular-nums text-zinc-400">{s.count} posições</p>
          </Card>
          <Card title="Pipeline">
            <ul className="space-y-1">
              {projectPipeline.map((row) => (
                <li key={row.id} className="flex justify-between">
                  <span>{row.name}</span>
                  <span className="text-zinc-500">{row.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )
    }
    case 'conversation': {
      const validCompany =
        opts?.initialConversationCompanyId &&
        companies.some((c) => c.id === opts.initialConversationCompanyId)
          ? opts.initialConversationCompanyId
          : undefined
      return (
        <ConversationMetadataSidebar
          conversationId={p.id}
          initialQuickCompanyId={
            p.id === 'new' ? validCompany ?? undefined : undefined
          }
        />
      )
    }
    case 'company': {
      const co = companies.find((x) => x.id === p.id)
      if (!co) return null
      return (
        <>
          <Card title="Empresa">
            <p className="font-semibold">{co.name}</p>
            <p className="text-zinc-400">
              {co.industry} · {co.size}
            </p>
          </Card>
          <CompanyPeopleSidebarField companyId={co.id} companyName={co.name} />
          <Card title="Mapa">
            <p className="text-zinc-400">
              Relações entre empresas na área principal ao focar esta conta.
            </p>
          </Card>
        </>
      )
    }
    case 'knowledge':
      return (
        <>
          <Card title="Wiki">
            <p className="font-medium">{knowledgePage.title}</p>
            <p className="mt-2 line-clamp-4 text-zinc-400">
              {knowledgePage.body.slice(0, 120)}…
            </p>
          </Card>
          <Card title="Plia">
            <p>Contexto, web, escrita com IA e hashtags.</p>
          </Card>
        </>
      )
    case 'plia':
      return (
        <>
          <Card title="Plia">
            <p className="text-zinc-400">
              Busca contextual na base; foco abre este painel para referência rápida.
            </p>
          </Card>
          <Card title="Atalhos">
            <p className="text-zinc-400">Hashtags e histórico aparecem no composer.</p>
          </Card>
        </>
      )
    default:
      return null
  }
}

function renderByPathname(pathname: string): ReactNode {
  let body: ReactNode = (
    <p className="text-sm text-zinc-400">Selecione um item na lista central.</p>
  )

  if (pathname === '/' || pathname.startsWith('/home')) {
    body = (
      <>
        <Card title="Projetos em andamento">
          <ul className="space-y-2">
            {runningProjects.slice(0, 2).map((p) => (
              <li key={p.id}>
                <span className="font-medium">{p.name}</span>
                <span className="text-zinc-500"> · {p.client}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Atalhos">
          <p className="text-zinc-400">
            + Contato, + Negócio e + Conhecimento aparecem na Home como ações rápidas.
          </p>
        </Card>
      </>
    )
  } else if (pathname === '/contacts/new') {
    body = (
      <>
        <Card title="Rascunho">
          <p className="text-zinc-400">
            Use o painel à direita para nome, e-mail e telefone. Tudo fica salvo neste
            navegador até sincronizar.
          </p>
        </Card>
      </>
    )
  } else if (
    pathname.startsWith('/contacts') ||
    /^\/contact\/[^/]+$/u.test(pathname)
  ) {
    body = (
      <>
        <Card title="Contatos">
          <p className="text-zinc-400">
            Selecione uma pessoa na lista ou abra um link com <code className="text-coral-300/90">?detail=contact:…</code>
            . O currículo completo aparece na superfície principal.
          </p>
        </Card>
        <Card title="Atalhos">
          <p className="text-zinc-400">Novo contato: rota /contacts/new ou parâmetro contact:new.</p>
        </Card>
      </>
    )
  } else if (pathname.startsWith('/deals/')) {
    const segment = pathname.slice('/deals/'.length).split('/')[0]
    let dealId = segment
    try {
      dealId = decodeURIComponent(segment)
    } catch {
      /* mantém segment */
    }
    if (dealId === 'new') {
      body = (
        <>
          <Card title="Novo negócio">
            <p className="text-zinc-400">
              Use o formulário à direita para nome, estágio, valor e relações.
            </p>
          </Card>
        </>
      )
    } else {
      const d = deals.find((x) => x.id === dealId)
      body = d ? (
        <>
          <Card title="Negócio">
            <p className="font-semibold">{d.name}</p>
            <p className="mt-1">
              Estágio: <strong>{d.stage}</strong>
            </p>
            <p className="mt-1 text-zinc-400">
              Valor: R$ {(d.value / 1000).toFixed(0)}k · Prob. {d.prob}%
            </p>
          </Card>
          <Card title="Próximos passos">
            <p>Agendar revisão de proposta com Aurora.</p>
          </Card>
        </>
      ) : (
        <p className="text-sm text-zinc-400">Negócio não encontrado.</p>
      )
    }
  } else if (pathname.startsWith('/deals')) {
    const d = deals[0]
    body = (
      <>
        <Card title="Negócio">
          <p className="font-semibold">{d.name}</p>
          <p className="mt-1">
            Estágio: <strong>{d.stage}</strong>
          </p>
          <p className="mt-1 text-zinc-400">
            Valor: R$ {(d.value / 1000).toFixed(0)}k · Prob. {d.prob}%
          </p>
        </Card>
        <Card title="Próximos passos">
          <p>Agendar revisão de proposta com Aurora.</p>
        </Card>
      </>
    )
  } else if (pathname.startsWith('/projects')) {
    body = (
      <>
        <Card title="Pipeline ATS">
          <ul className="space-y-1">
            {projectPipeline.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>{s.name}</span>
                <span className="text-zinc-500">{s.count}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Candidato em foco">
          <p className="font-medium">{candidates[0].name}</p>
          <p className="text-zinc-400">
            {candidates[0].role} · {candidates[0].project}
          </p>
        </Card>
      </>
    )
  } else if (pathname.startsWith('/knowledge')) {
    body = (
      <>
        <Card title="Wiki">
          <p className="font-medium">{knowledgePage.title}</p>
          <p className="mt-2 line-clamp-4 text-zinc-400">
            {knowledgePage.body.slice(0, 120)}…
          </p>
        </Card>
        <Card title="Plia">
          <p>Contexto, web, escrita com IA e hashtags.</p>
        </Card>
      </>
    )
  } else if (pathname.startsWith('/conversations')) {
    body = (
      <>
        <Card title="Conversas">
          <p className="text-zinc-400">
            Clique em uma frase na nuvem ou use{' '}
            <code className="text-coral-300/90">?detail=conversation:…</code>. Metadados ficam
            aqui; a transcrição editável aparece na área principal.
          </p>
        </Card>
        <Card title="Ações (mock)">
          <p className="text-zinc-400">Gerar follow-up · Gerar negócio</p>
        </Card>
      </>
    )
  } else if (pathname.startsWith('/companies')) {
    const co = companies[0]
    body = (
      <>
        <Card title="Empresa">
          <p className="font-semibold">{co.name}</p>
          <p className="text-zinc-400">
            {co.industry} · {co.size}
          </p>
        </Card>
        <Card title="Mapa">
          <p className="text-zinc-400">
            Relações e contatos aparecem na área principal ao selecionar uma empresa.
          </p>
        </Card>
      </>
    )
  }

  return body
}

function SaveStatusIndicator({
  status,
  onActivate,
}: {
  status: ContactAutosaveStatus
  onActivate?: () => void
}) {
  const dot =
    status === 'saving'
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.45)]'
      : status === 'validation-error'
        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.45)]'
        : status === 'connection-error'
          ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
          : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]'
  const label =
    status === 'saving'
      ? 'Salvando…'
      : status === 'validation-error'
        ? 'Erro'
        : status === 'connection-error'
          ? 'Sem conexão'
          : 'Salvo'
  return (
    <button
      type="button"
      onClick={() => {
        if (status === 'validation-error') onActivate?.()
      }}
      disabled={status !== 'validation-error'}
      className={`flex max-w-[7rem] shrink-0 items-center gap-1.5 text-left text-[10px] leading-none text-zinc-400 ${
        status === 'validation-error'
          ? 'cursor-pointer rounded-md hover:text-zinc-200'
          : status === 'connection-error'
            ? 'cursor-default'
            : ''
      } disabled:cursor-default disabled:opacity-100`}
      title={
        status === 'validation-error'
          ? 'Mostrar campo com erro'
          : status === 'connection-error'
            ? 'Aguardando conexão para sincronizar'
            : label
      }
      aria-label={label}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      <span className="truncate">{label}</span>
    </button>
  )
}

export type FloatingDetailPanelProps = {
  /** Chamado quando o fechamento é ignorado (ex.: erro de conexão no novo contato). */
  onCloseBlocked?: () => void
}

/** Painel estilo janela — detalhes à direita, sobre o canvas da Plia */
export function FloatingDetailPanel({ onCloseBlocked }: FloatingDetailPanelProps = {}) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { isOpen, closeDetailPanel, detailKey } = useDetailPanel()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const contactFormRef = useRef<ContactNewFormHandle>(null)
  const { saveStatus: newContactSaveFromDraft } = useContactNewDraft()

  const newContactDetail = useMemo(() => {
    const p = detailKey ? parseDetailKey(detailKey) : null
    return p?.kind === 'contact' && p.id === 'new'
  }, [detailKey])

  const newContactSave = newContactDetail ? newContactSaveFromDraft : 'saved'

  const [present, setPresent] = useState(isOpen)
  const [entered, setEntered] = useState(false)

  useLayoutEffect(() => {
    if (isOpen) {
      setPresent(true)
      if (prefersReducedMotion()) {
        setEntered(true)
        return
      }
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true))
      })
      return () => cancelAnimationFrame(id)
    }
    setEntered(false)
  }, [isOpen])

  /** Alinha desmonte à duração do CSS (sem depender só de transitionend; cobre motion-reduce). */
  useEffect(() => {
    if (!isOpen && present) {
      const delay = prefersReducedMotion() ? 0 : PANEL_TRANSITION_MS
      const id = window.setTimeout(() => setPresent(false), delay)
      return () => window.clearTimeout(id)
    }
  }, [isOpen, present])

  const specific = renderByDetailKey(detailKey, {
    initialConversationCompanyId: searchParams.get('companyId'),
  })
  const body = newContactDetail ? (
    <ContactNewForm ref={contactFormRef} />
  ) : (
    specific ?? renderByPathname(pathname)
  )
  const panelTitle = getDetailPanelTitle(detailKey, pathname)

  const closeBlockedByContact =
    Boolean(newContactDetail) && newContactSave === 'connection-error'

  useRegisterDetailPanelCloseBlock(closeBlockedByContact)

  const tryCloseDetailPanel = useCallback(() => {
    if (closeBlockedByContact) {
      onCloseBlocked?.()
      return
    }
    closeDetailPanel()
  }, [closeBlockedByContact, closeDetailPanel, onCloseBlocked])

  useEffect(() => {
    if (!isOpen || !closeBlockedByContact) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onCloseBlocked?.()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [isOpen, closeBlockedByContact, onCloseBlocked])

  const copyShareLink = useCallback(async () => {
    if (!detailKey) return
    try {
      const url = new URL(window.location.href)
      const parsed = parseDetailKey(detailKey)
      if (parsed?.kind === 'project') {
        url.pathname = `/projects/${parsed.id}`
        url.searchParams.delete('detail')
      } else if (parsed?.kind === 'contact') {
        url.pathname =
          parsed.id === 'new' ? '/contacts/new' : `/contact/${parsed.id}`
        url.searchParams.set('detail', detailKey)
      } else if (parsed?.kind === 'conversation') {
        url.pathname = `/conversations/${parsed.id}`
        url.searchParams.delete('detail')
      } else {
        url.searchParams.set('detail', detailKey)
      }
      await navigator.clipboard.writeText(url.toString())
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }, [detailKey])

  if (pathname === '/kb' || pathname.startsWith('/kb/')) {
    return null
  }

  if (
    pathname.startsWith('/knowledge') ||
    pathname === '/' ||
    pathname.startsWith('/home')
  ) {
    return null
  }

  if (!present) {
    return null
  }

  const exiting = !isOpen

  return createPortal(
    <div
      className={`fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[45] flex flex-col overflow-hidden rounded-2xl border border-zinc-600/90 bg-zinc-900/95 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] ring-1 ring-coral-500/10 backdrop-blur-md bottom-[calc(3.5rem+3rem+env(safe-area-inset-bottom))] md:inset-x-auto md:right-3 md:bottom-[calc(3rem+env(safe-area-inset-bottom))] md:left-auto md:w-[min(calc(100vw-1.5rem),20rem)] transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none ${
        closeBlockedByContact
          ? 'ring-2 ring-orange-400/70 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65),0_0_0_3px_rgba(249,115,22,0.25)]'
          : ''
      } ${
        exiting
          ? 'pointer-events-none translate-y-full'
          : entered
            ? 'translate-y-0'
            : 'translate-y-full'
      }`}
      style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
      role="complementary"
      aria-label="Painel de detalhe"
    >
      <span className="sr-only" aria-live="polite">
        {copyStatus === 'copied' && 'Link copiado'}
        {copyStatus === 'error' && 'Não foi possível copiar'}
      </span>
      <div className="relative z-10 flex h-10 shrink-0 items-center justify-between gap-2 border-b border-zinc-700/90 bg-zinc-950/90 px-3">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold tracking-tight text-zinc-300">
          {panelTitle}
        </span>
        {newContactDetail ? (
          <SaveStatusIndicator
            status={newContactSave}
            onActivate={() => contactFormRef.current?.highlightInvalidEmail()}
          />
        ) : null}
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              void copyShareLink()
            }}
            disabled={!detailKey}
            className="relative z-20 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Copiar link do detalhe"
            title={
              detailKey ? 'Copiar link para este detalhe' : 'Abra um item para gerar link'
            }
          >
            <Link2 className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              tryCloseDetailPanel()
            }}
            className={`relative z-20 rounded-lg p-1.5 transition-colors hover:bg-zinc-800 ${
              closeBlockedByContact
                ? 'cursor-not-allowed text-zinc-600 opacity-60 hover:text-zinc-600'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
            aria-label="Fechar painel de detalhe"
            aria-disabled={closeBlockedByContact}
            title={
              closeBlockedByContact
                ? 'Sem conexão: feche após restabelecer a rede'
                : undefined
            }
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3">
        {body}
      </div>
    </div>,
    document.body,
  )
}
