import type { AutosaveStatus } from '../lib/autosaveStatus'

type Props = {
  status: AutosaveStatus
  /** validation-error: focar campo com problema */
  onActivate?: () => void
}

/**
 * Farol de salvamento — mesmo padrão visual do cabeçalho do FloatingDetailPanel
 * (ponto colorido + rótulo).
 */
export function SaveStatusBeacon({ status, onActivate }: Props) {
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
