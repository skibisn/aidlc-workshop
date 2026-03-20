import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminClient from '../../api/adminClient'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveAuth } = useAdminAuth()
  const [form, setForm] = useState({ storeIdentifier: 'store-001', username: 'admin', password: 'password' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await adminClient.post('/auth/login', form)
      saveAuth(res.data.token, res.data.storeId)
      navigate('/admin/dashboard')
    } catch {
      setError('로그인에 실패했습니다. 계정 정보를 확인해 주세요.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🍽️</div>
        <div style={{ color: 'var(--secondary)', fontSize: 24, fontWeight: 700 }}>TableOrder</div>
        <div style={{ color: '#aab7b8', fontSize: 14, marginTop: 4 }}>관리자 콘솔</div>
      </div>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div className="card-header" style={{ textAlign: 'center' }}>관리자 로그인</div>
        <div className="card-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">매장 식별자</label>
              <input className="form-input" data-testid="login-store-input"
                value={form.storeIdentifier}
                onChange={e => setForm(f => ({ ...f, storeIdentifier: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">아이디</label>
              <input className="form-input" data-testid="login-username-input"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input className="form-input" data-testid="login-password-input"
                type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button className="btn btn-primary btn-full" data-testid="login-submit-button"
              type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <div style={{ marginTop: 16, padding: 12, background: '#fef9e7', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)' }}>
            💡 데모: store-001 / admin / password
          </div>
        </div>
      </div>
    </div>
  )
}
