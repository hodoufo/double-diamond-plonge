import { useMemo } from 'react'
import {
  companies,
  companyGraphEdges,
  contacts,
  type CompanyGraphEdge,
} from '../data/mock'

const VIEW = { w: 920, h: 520, cx: 460, cy: 260 }
const R1 = 185
const R2 = 315
const W_CO = 112
const H_CO = 46
const W_CT = 100
const H_CT = 34

const RELATION_LABEL: Record<CompanyGraphEdge['relation'], string> = {
  parceiro: 'Parceiro',
  matriz_filial: 'Matriz / filial',
  fornecedor: 'Fornecedor',
}

function buildAdj(edges: CompanyGraphEdge[]) {
  const adj = new Map<string, string[]>()
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, [])
    if (!adj.has(e.to)) adj.set(e.to, [])
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }
  return adj
}

/** Empresas a até `maxHops` saltos (arestas não direcionadas). */
function neighborhoodCompanyIds(
  focalId: string,
  edges: CompanyGraphEdge[],
  maxHops: number,
): Set<string> {
  const adj = buildAdj(edges)
  let frontier = new Set([focalId])
  const all = new Set(frontier)
  for (let hop = 0; hop < maxHops; hop++) {
    const nextFrontier = new Set<string>()
    for (const u of frontier) {
      for (const v of adj.get(u) ?? []) {
        if (!all.has(v)) {
          all.add(v)
          nextFrontier.add(v)
        }
      }
    }
    frontier = nextFrontier
  }
  return all
}

function bfsDistanceFrom(
  start: string,
  edges: CompanyGraphEdge[],
): Map<string, number> {
  const adj = buildAdj(edges)
  const dist = new Map<string, number>()
  const q: string[] = [start]
  dist.set(start, 0)
  while (q.length) {
    const u = q.shift()!
    const d = dist.get(u)!
    for (const v of adj.get(u) ?? []) {
      if (!dist.has(v)) {
        dist.set(v, d + 1)
        q.push(v)
      }
    }
  }
  return dist
}

function placeRing(
  ids: string[],
  radius: number,
  startAngle: number,
): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>()
  const n = ids.length
  if (n === 0) return pos
  for (let i = 0; i < n; i++) {
    const a = startAngle + (i * 2 * Math.PI) / n
    pos.set(ids[i]!, {
      x: VIEW.cx + radius * Math.cos(a),
      y: VIEW.cy + radius * Math.sin(a),
    })
  }
  return pos
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

export type CompanyRelationGraphProps = {
  focalCompanyId: string
  maxHops?: number
  onCompanyNodeClick?: (companyId: string) => void
  onContactNodeClick?: (contactId: string) => void
}

export function CompanyRelationGraph({
  focalCompanyId,
  maxHops = 2,
  onCompanyNodeClick,
  onContactNodeClick,
}: CompanyRelationGraphProps) {
  const layout = useMemo(() => {
    const inScope = neighborhoodCompanyIds(
      focalCompanyId,
      companyGraphEdges,
      maxHops,
    )
    const dist = bfsDistanceFrom(focalCompanyId, companyGraphEdges)

    const hop1 = [...inScope].filter(
      (id) => id !== focalCompanyId && (dist.get(id) ?? 99) === 1,
    )
    const hop2 = [...inScope].filter((id) => (dist.get(id) ?? 99) === 2)

    hop1.sort()
    hop2.sort()

    const pos = new Map<string, { x: number; y: number }>()
    pos.set(focalCompanyId, { x: VIEW.cx, y: VIEW.cy })
    placeRing(hop1, R1, -Math.PI / 2).forEach((p, id) => pos.set(id, p))
    placeRing(hop2, R2, -Math.PI / 2 + Math.PI / Math.max(hop2.length * 2, 8)).forEach(
      (p, id) => pos.set(id, p),
    )

    const contactsForScope = contacts.filter((c) => inScope.has(c.companyId))
    for (const coId of inScope) {
      const base = pos.get(coId)
      if (!base) continue
      const cts = contactsForScope.filter((c) => c.companyId === coId)
      const spread = 52
      cts.forEach((ct, i) => {
        const side = i % 2 === 0 ? 1 : -1
        const row = Math.floor(i / 2)
        pos.set(`__contact__${ct.id}`, {
          x: base.x + side * spread,
          y: base.y + H_CO / 2 + 18 + row * 36,
        })
      })
    }

    const edgesDraw: Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      label: string
      muted?: boolean
    }> = []

    for (const e of companyGraphEdges) {
      if (!inScope.has(e.from) || !inScope.has(e.to)) continue
      const a = pos.get(e.from)
      const b = pos.get(e.to)
      if (!a || !b) continue
      edgesDraw.push({
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        label: RELATION_LABEL[e.relation],
      })
    }

    for (const ct of contactsForScope) {
      const cp = pos.get(`__contact__${ct.id}`)
      const bp = pos.get(ct.companyId)
      if (!cp || !bp) continue
      edgesDraw.push({
        x1: bp.x,
        y1: bp.y + H_CO / 2,
        x2: cp.x,
        y2: cp.y - H_CT / 2,
        label: 'Contato',
        muted: true,
      })
    }

    return { pos, edgesDraw, inScope }
  }, [focalCompanyId, maxHops])

  const companyById = useMemo(
    () => new Map(companies.map((c) => [c.id, c] as const)),
    [],
  )

  return (
    <svg
      key={focalCompanyId}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="h-[min(52vh,520px)] w-full select-none"
      aria-label="Grafo de relações entre empresas e contatos"
    >
      <defs>
        <linearGradient id="coGraphBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
        <filter id="coGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={VIEW.w} height={VIEW.h} fill="url(#coGraphBg)" rx="12" />

      {layout.edgesDraw.map((e, i) => {
        const mx = (e.x1 + e.x2) / 2
        const my = (e.y1 + e.y2) / 2
        const stroke = e.muted ? '#52525b' : '#a1a1aa'
        const opacity = e.muted ? 0.55 : 0.85
        return (
          <g key={`e-${i}`}>
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={stroke}
              strokeWidth={e.muted ? 1.25 : 1.75}
              strokeOpacity={opacity}
            />
            <rect
              x={mx - 36}
              y={my - 9}
              width={72}
              height={16}
              rx={4}
              fill="#27272a"
              opacity={0.92}
            />
            <text
              x={mx}
              y={my + 3}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] font-medium"
              style={{ fontSize: 9 }}
            >
              {e.label}
            </text>
          </g>
        )
      })}

      {[...layout.inScope].map((id) => {
        const c = companyById.get(id)
        const p = layout.pos.get(id)
        if (!c || !p) return null
        const isFocal = id === focalCompanyId
        const x = p.x - W_CO / 2
        const y = p.y - H_CO / 2
        return (
          <g
            key={id}
            className="cursor-pointer"
            onClick={() => onCompanyNodeClick?.(id)}
            filter={isFocal ? 'url(#coGlow)' : undefined}
          >
            <rect
              x={x}
              y={y}
              width={W_CO}
              height={H_CO}
              rx={12}
              fill={isFocal ? '#3f3f46' : '#27272a'}
              stroke={isFocal ? '#e7b5a8' : '#52525b'}
              strokeWidth={isFocal ? 2 : 1}
            />
            <text
              x={p.x}
              y={p.y - 4}
              textAnchor="middle"
              className="pointer-events-none fill-zinc-100 text-[11px] font-semibold"
            >
              {truncate(c.name, 14)}
            </text>
            <text
              x={p.x}
              y={p.y + 10}
              textAnchor="middle"
              className="pointer-events-none fill-zinc-500 text-[9px]"
            >
              {truncate(c.industry, 16)}
            </text>
          </g>
        )
      })}

      {contacts
        .filter((c) => layout.inScope.has(c.companyId))
        .map((ct) => {
          const p = layout.pos.get(`__contact__${ct.id}`)
          if (!p) return null
          const x = p.x - W_CT / 2
          const y = p.y - H_CT / 2
          return (
            <g
              key={ct.id}
              className="cursor-pointer"
              onClick={() => onContactNodeClick?.(ct.id)}
            >
              <rect
                x={x}
                y={y}
                width={W_CT}
                height={H_CT}
                rx={10}
                fill="#18181b"
                stroke="#71717a"
                strokeWidth={1}
              />
              <text
                x={p.x}
                y={p.y - 2}
                textAnchor="middle"
                className="pointer-events-none fill-zinc-200 text-[10px] font-medium"
              >
                {truncate(ct.name, 13)}
              </text>
              <text
                x={p.x}
                y={p.y + 11}
                textAnchor="middle"
                className="pointer-events-none fill-zinc-500 text-[8px]"
              >
                {truncate(ct.role, 15)}
              </text>
            </g>
          )
        })}
    </svg>
  )
}

export function CompanyGraphEmptyState() {
  return (
    <div
      className="flex h-[min(52vh,520px)] min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-600/80 bg-zinc-950/80 px-6 text-center"
      role="status"
    >
      <p className="max-w-sm text-sm font-medium text-zinc-300">
        Nenhuma empresa em foco.
      </p>
      <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
        Escolha uma empresa na lista abaixo ou abra o painel com{' '}
        <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-400">
          ?detail=company:…
        </code>{' '}
        para ver o grafo de relações e contatos no entorno (até 2 saltos).
      </p>
    </div>
  )
}
