import { createContext } from 'react'

export type DetailPanelValue = {
  isOpen: boolean
  /** Valor do query param `detail` (ex.: `contact:c1`), se existir */
  detailKey: string | null
  openDetailPanel: (opts?: { detail?: string }) => void
  closeDetailPanel: () => void
}

export const DetailPanelContext = createContext<DetailPanelValue | null>(null)

/** Ref compartilhada com o provider: painéis podem impedir `closeDetailPanel`. */
export const detailPanelCloseBlockedRef = { current: false }
