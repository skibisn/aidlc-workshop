import { beforeEach, describe, expect, it } from 'vitest'
import { useAdminAuth } from '../../admin/hooks/useAdminAuth'

describe('useAdminAuth', () => {
  beforeEach(() => localStorage.clear())

  const auth = () => useAdminAuth()

  it('초기 상태: 미인증', () => {
    expect(auth().isAuthenticated()).toBe(false)
    expect(auth().getToken()).toBeNull()
    expect(auth().getStoreId()).toBeNull()
  })

  it('인증 정보 저장 후 조회', () => {
    auth().saveAuth('jwt-token', 1)
    expect(auth().isAuthenticated()).toBe(true)
    expect(auth().getToken()).toBe('jwt-token')
    expect(auth().getStoreId()).toBe(1)
  })

  it('인증 정보 삭제', () => {
    auth().saveAuth('jwt-token', 1)
    auth().clearAuth()
    expect(auth().isAuthenticated()).toBe(false)
  })
})
