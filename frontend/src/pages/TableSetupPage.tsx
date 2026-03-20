import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useSession } from '../hooks/useSession'

export default function TableSetupPage() {
  const navigate = useNavigate()
  const { saveSession } = useSession()
  const [form, setForm] = useState({ storeIdentifier: 'store-001', tableNumber: '1', password: 'password' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await client.post('/tables/auto-login', form)
      saveSession({ storeId: res.data.storeId, tableId: res.data.tableId, sessionId: res.data.sessionId })
      navigate('/menu')
    } catch {
      setError('로그인에 실패했습니다. 입력 정보를 확인해 주세요.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder</span>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ width: '100%', maxWidth: 400 }}>
          <div className="card-header" style={{ textAlign: 'center', fontSize: 17 }}>
            테이블 시작하기
          </div>
          <div className="card-body">
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center' }}>
              매장 정보를 입력하면 바로 주문을 시작할 수 있습니다
            </p>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">매장 식별자</label>
                <input className="form-input" data-testid="setup-store-input"
                  value={form.storeIdentifier}
                  onChange={e => setForm(f => ({ ...f, storeIdentifier: e.target.value }))}
                  placeholder="store-001" required />
              </div>
              <div className="form-group">
                <label className="form-label">테이블 번호</label>
                <input className="form-input" data-testid="setup-table-input"
                  value={form.tableNumber}
                  onChange={e => setForm(f => ({ ...f, tableNumber: e.target.value }))}
                  placeholder="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <input className="form-input" data-testid="setup-password-input"
                  type="password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="테이블 비밀번호" required />
              </div>
              <button className="btn btn-primary btn-full" data-testid="setup-submit-button"
                type="submit" disabled={loading}>
                {loading ? '연결 중...' : '🚀 주문 시작'}
              </button>
            </form>
            <div style={{ marginTop: 16, padding: 12, background: '#fef9e7', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)' }}>
              💡 데모: store-001 / 테이블 1~5 / 비밀번호 password
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
