import { useContext } from 'react'
import {
  DetailPanelContext,
  type DetailPanelValue,
} from './detailPanelContextBase'

export function useDetailPanel(): DetailPanelValue {
  const ctx = useContext(DetailPanelContext)
  if (ctx == null) {
    throw new Error('useDetailPanel must be used within DetailPanelProvider')
  }
  return ctx
}
