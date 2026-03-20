import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useSession } from '../hooks/useSession'
import { Order } from '../types'
import { formatDateTime } from '../utils/format'

const STATUS_LABEL: Record<string, string> = { PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료' }
const STATUS_CLASS: Record<string, string> = { PENDING: 'badge-pending', PREPARING: 'badge-preparing', COMPLETED: 'badge-completed' }

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { getSession } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session) { navigate('/setup'); return }
    client.get<Order[]>(`/orders?tableId=${session.tableId}&sessionId=${session.sessionId}`)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder</span>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/menu')}>← 메뉴로</button>
      </nav>
      <div className="page" style={{ maxWidth: 600 }}>
        <h1 className="page-title">📋 주문 내역</h1>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>불러오는 중...</div>
        ) : orders.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">아직 주문 내역이 없습니다</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => (
              <div key={order.id} className="card" data-testid={`order-history-item-${order.id}`}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 700 }}>주문 #{order.id}</span>
                    <span className={`badge ${STATUS_CLASS[order.status]}`} data-testid={`order-status-${order.id}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                    {formatDateTime(order.createdAt)}
                  </div>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                      <span>{item.menuName} × {item.quantity}</span>
                      <span>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                  <hr className="divider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>합계</span>
                    <span style={{ color: 'var(--accent)' }}>{order.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
