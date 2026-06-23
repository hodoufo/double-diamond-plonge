import { useEffect } from 'react'
import { detailPanelCloseBlockedRef } from './detailPanelContextBase'

export function useRegisterDetailPanelCloseBlock(blocked: boolean) {
  useEffect(() => {
    detailPanelCloseBlockedRef.current = blocked
    return () => {
      detailPanelCloseBlockedRef.current = false
    }
  }, [blocked])
}
