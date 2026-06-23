export const DEV_OFFLINE_KEY = 'plonge:devSimulateOffline'

export function isConnectionDown(): boolean {
  if (typeof window === 'undefined') return false
  if (!navigator.onLine) return true
  try {
    return window.localStorage.getItem(DEV_OFFLINE_KEY) === '1'
  } catch {
    return false
  }
}
