import { beforeEach, describe, expect, it } from 'vitest'
import { useSession } from '../../hooks/useSession'

describe('useSession', () => {
  beforeEach(() => localStorage.clear())

  const session = () => useSession()

  it('세션 없으면 null 반환', () => {
    expect(session().getSession()).toBeNull()
  })

  it('세션 저장 후 조회', () => {
    session().saveSession({ storeId: 1, tableId: 2, sessionId: 'uuid-123' })
    expect(session().getSession()).toEqual({ storeId: 1, tableId: 2, sessionId: 'uuid-123' })
  })

  it('세션 삭제', () => {
    session().saveSession({ storeId: 1, tableId: 2, sessionId: 'uuid-123' })
    session().clearSession()
    expect(session().getSession()).toBeNull()
  })
})
