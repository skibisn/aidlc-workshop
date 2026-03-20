import { SessionInfo } from '../types'

const KEYS = {
  storeId: 'tableorder_store_id',
  tableId: 'tableorder_table_id',
  sessionId: 'tableorder_session_id',
}

export function useSession() {
  function getSession(): SessionInfo | null {
    const storeId = localStorage.getItem(KEYS.storeId)
    const tableId = localStorage.getItem(KEYS.tableId)
    const sessionId = localStorage.getItem(KEYS.sessionId)
    if (!storeId || !tableId || !sessionId) return null
    return { storeId: Number(storeId), tableId: Number(tableId), sessionId }
  }

  function saveSession(info: SessionInfo) {
    localStorage.setItem(KEYS.storeId, String(info.storeId))
    localStorage.setItem(KEYS.tableId, String(info.tableId))
    localStorage.setItem(KEYS.sessionId, info.sessionId)
  }

  function clearSession() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  }

  return { getSession, saveSession, clearSession }
}
