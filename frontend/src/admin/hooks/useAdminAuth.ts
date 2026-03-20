const TOKEN_KEY = 'admin_token'
const STORE_ID_KEY = 'admin_store_id'

export function useAdminAuth() {
  function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  function getStoreId(): number | null {
    const v = localStorage.getItem(STORE_ID_KEY)
    return v ? Number(v) : null
  }

  function saveAuth(token: string, storeId: number) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(STORE_ID_KEY, String(storeId))
  }

  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORE_ID_KEY)
  }

  function isAuthenticated(): boolean {
    return !!getToken()
  }

  return { getToken, getStoreId, saveAuth, clearAuth, isAuthenticated }
}
