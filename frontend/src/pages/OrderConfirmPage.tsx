import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useCart } from '../hooks/useCart'
import { useSession } from '../hooks/useSession'

export default function OrderConfirmPage() {
  const navigate = useNavigate()
  const { getCart, clearCart, getTotalAmount } = useCart()
  const { getSession } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const cart = getCart()
  const session = getSession()

  async function handleOrder() {
    if (!session || cart.length === 0) return
    setIsSubmitting(true); setError('')
    try {
      const res = await client.post('/orders', {
        tableId: session.tableId, sessionId: session.sessionId, storeId: session.storeId,
        items: cart.map(i => ({ menuId: i.menuId, quantity: i.quantity })),
      })
      setOrderId(res.data.orderId)
      clearCart()
      setTimeout(() => navigate('/menu'), 3000)
    } catch {
      setError('주문에 실패했습니다. 다시 시도해 주세요.')
    } finally { setIsSubmitting(false) }
  }

  if (orderId) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div className="card-body" style={{ padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ marginBottom: 8 }}>주문 완료!</h2>
            <p data-testid="order-success-message" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              주문번호 <strong>#{orderId}</strong>
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>잠시 후 메뉴 화면으로 이동합니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder</span>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/cart')}>← 장바구니</button>
      </nav>
      <div className="page" style={{ maxWidth: 600 }}>
        <h1 className="page-title">주문 확인</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">주문 내역</div>
          <div className="card-body" style={{ padding: 0 }}>
            {cart.map((item, i) => (
              <div key={item.menuId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < cart.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span>{item.menuName} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>최종 금액</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{getTotalAmount().toLocaleString()}원</span>
            </div>
            <button className="btn btn-primary btn-full" data-testid="confirm-submit-button"
              onClick={handleOrder} disabled={isSubmitting || cart.length === 0}
              style={{ fontSize: 16, minHeight: 52 }}>
              {isSubmitting ? '주문 처리 중...' : '✓ 주문 확정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
