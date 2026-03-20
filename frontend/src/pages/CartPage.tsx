import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function CartPage() {
  const navigate = useNavigate()
  const { getCart, removeItem, updateQuantity, getTotalAmount } = useCart()
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const cart = getCart()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder</span>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/menu')}>← 메뉴로</button>
      </nav>
      <div className="page" style={{ maxWidth: 600 }}>
        <h1 className="page-title">🛒 장바구니</h1>

        {cart.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-text">장바구니가 비어있습니다</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/menu')}>메뉴 보러가기</button>
            </div>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">주문 목록 ({cart.length}개)</div>
              <div className="card-body" style={{ padding: 0 }}>
                {cart.map((item, i) => (
                  <div key={item.menuId} data-testid={`cart-item-${item.menuId}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < cart.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.menuName}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.unitPrice.toLocaleString()}원</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" data-testid={`quantity-decrease-${item.menuId}`}
                        onClick={() => { updateQuantity(item.menuId, item.quantity - 1); refresh() }}
                        style={{ width: 32, minHeight: 32, padding: 0 }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-secondary btn-sm" data-testid={`quantity-increase-${item.menuId}`}
                        onClick={() => { updateQuantity(item.menuId, item.quantity + 1); refresh() }}
                        style={{ width: 32, minHeight: 32, padding: 0 }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
                      {(item.unitPrice * item.quantity).toLocaleString()}원
                    </div>
                    <button className="btn btn-danger btn-sm" data-testid={`cart-delete-${item.menuId}`}
                      onClick={() => { removeItem(item.menuId); refresh() }}
                      style={{ width: 32, minHeight: 32, padding: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>합계</span>
                  <span data-testid="cart-total" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
                    {getTotalAmount().toLocaleString()}원
                  </span>
                </div>
                <button className="btn btn-primary btn-full" data-testid="cart-order-button"
                  onClick={() => navigate('/order/confirm')} disabled={cart.length === 0}>
                  주문하기 →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
