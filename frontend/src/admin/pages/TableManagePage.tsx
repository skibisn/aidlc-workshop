import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminClient from '../../api/adminClient'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { Order, OrderHistory } from '../../types'
import { formatDateTime } from '../../utils/format'

interface TableInfo { id: number; tableNumber: string; totalAmount: number; currentSessionId: string | null; orders: Order[] }

export default function TableManagePage() {
  const navigate = useNavigate()
  const { getStoreId } = useAdminAuth()
  const [tables, setTables] = useState<TableInfo[]>([])
  const [history, setHistory] = useState<{ tableId: number; items: OrderHistory[] } | null>(null)
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null)
  const storeId = getStoreId()

  useEffect(() => { loadTables() }, [])

  async function loadTables() {
    const [ordersRes, tablesRes] = await Promise.all([
      adminClient.get<Order[]>(`/orders?storeId=${storeId}`),
      adminClient.get<{ id: number; tableNumber: string }[]>('/tables'),
    ])
    const tableMap = new Map(tablesRes.data.map(t => [t.id, t.tableNumber]))
    const map = new Map<number, TableInfo>()
    ordersRes.data.forEach(o => {
      if (!map.has(o.tableId)) map.set(o.tableId, {
        id: o.tableId,
        tableNumber: tableMap.get(o.tableId) ?? String(o.tableId),
        totalAmount: 0, currentSessionId: o.sessionId, orders: []
      })
      const t = map.get(o.tableId)!
      t.totalAmount += Number(o.totalAmount); t.orders.push(o)
    })
    setTables(Array.from(map.values()))
  }

  async function deleteOrder(orderId: number) {
    await adminClient.delete(`/orders/${orderId}`)
    setConfirm(null); loadTables()
  }

  async function loadHistory(tableId: number) {
    const res = await adminClient.get<OrderHistory[]>(`/tables/${tableId}/history`)
    setHistory({ tableId, items: res.data })
  }

  const STATUS_CLASS: Record<string, string> = { PENDING: 'badge-pending', PREPARING: 'badge-preparing', COMPLETED: 'badge-completed', CANCELLED: '' }
  const STATUS_LABEL: Record<string, string> = { PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료', CANCELLED: '취소됨' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder 관리자</span>
        <div className="navbar-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/dashboard')}>← 대시보드</button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/menus')}>메뉴 관리</button>
        </div>
      </nav>
      <div className="page">
        <h1 className="page-title">🪑 테이블 관리</h1>
        {tables.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-state-icon">🪑</div><div className="empty-state-text">활성 테이블이 없습니다</div></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tables.map(table => (
              <div key={table.id} className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🪑 테이블 {table.tableNumber} — <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{table.totalAmount.toLocaleString()}원</span></span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" data-testid={`history-button-${table.id}`}
                      onClick={() => loadHistory(table.id)}>📂 과거 내역</button>
                  </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="table">
                    <thead><tr><th>주문번호</th><th>메뉴</th><th>금액</th><th>상태</th><th>삭제</th></tr></thead>
                    <tbody>
                      {table.orders.map(order => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: 600 }}>#{order.id}</td>
                          <td style={{ fontSize: 13 }}>{order.items?.map(i => `${i.menuName}×${i.quantity}`).join(', ') || '-'}</td>
                          <td style={{ fontWeight: 600 }}>{order.totalAmount.toLocaleString()}원</td>
                          <td><span className={`badge ${STATUS_CLASS[order.status]}`}>{STATUS_LABEL[order.status]}</span></td>
                          <td>
                            <button className="btn btn-danger btn-sm" data-testid={`delete-order-button-${order.id}`}
                              onClick={() => setConfirm({ id: order.id, label: `주문 #${order.id}을 삭제하시겠습니까?` })}>
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header"><span className="modal-title">확인</span></div>
            <div className="modal-body"><p>{confirm.label}</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirm(null)}>취소</button>
              <button className="btn btn-primary" onClick={() => deleteOrder(confirm.id)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {history && (
        <div className="modal-overlay" onClick={() => setHistory(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📂 과거 주문 내역</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setHistory(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              {history.items.length === 0 ? (
                <div className="empty-state"><div className="empty-state-text">내역이 없습니다</div></div>
              ) : history.items.map(h => (
                <div key={h.id} style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatDateTime(h.completedAt)}</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{h.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setHistory(null)}>닫기</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
