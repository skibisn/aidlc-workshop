import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminClient from '../../api/adminClient'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { Order } from '../../types'
import { formatFull } from '../../utils/format'

type Status = Order['status']

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중', PREPARING: '준비중', COMPLETED: '완료', CANCELLED: '취소됨',
}
const STATUS_TEXT: Record<string, string> = {
  PENDING: 'var(--status-pending-text)',
  PREPARING: 'var(--status-preparing-text)',
  COMPLETED: 'var(--status-completed-text)',
  CANCELLED: '#888',
}
const STATUS_BG: Record<string, string> = {
  PENDING: 'var(--status-pending-bg)',
  PREPARING: 'var(--status-preparing-bg)',
  COMPLETED: 'var(--status-completed-bg)',
  CANCELLED: '#f5f5f5',
}
const STATUS_BORDER: Record<string, string> = {
  PENDING: 'var(--status-pending-border)',
  PREPARING: 'var(--status-preparing-border)',
  COMPLETED: 'var(--status-completed-border)',
  CANCELLED: '#ddd',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { getStoreId, clearAuth } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [tableMap, setTableMap] = useState<Map<number, string>>(new Map())
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [changedIds, setChangedIds] = useState<Set<number>>(new Set())
  const [newIds, setNewIds] = useState<Set<number>>(new Set())
  const prevIds = useRef<Set<number>>(new Set())
  const sseRef = useRef<EventSource | null>(null)
  const storeId = getStoreId()

  useEffect(() => {
    if (!storeId) return
    load()
    const sse = new EventSource(`/api/sse/orders?storeId=${storeId}`)
    sseRef.current = sse
    sse.addEventListener('new-order', () => load())
    const poll = setInterval(() => load(), 10000)
    return () => { sse.close(); clearInterval(poll) }
  }, [])

  async function load() {
    const [ordersRes, tablesRes] = await Promise.all([
      adminClient.get<Order[]>(`/orders?storeId=${storeId}`),
      adminClient.get<{ id: number; tableNumber: string }[]>('/tables'),
    ])
    setTableMap(new Map(tablesRes.data.map(t => [t.id, t.tableNumber])))
    const incoming = ordersRes.data
    const fresh = incoming.filter(o => !prevIds.current.has(o.id)).map(o => o.id)
    if (fresh.length > 0) {
      setNewIds(new Set(fresh))
      setTimeout(() => setNewIds(new Set()), 4000)
    }
    prevIds.current = new Set(incoming.map(o => o.id))
    setOrders(incoming)
  }

  async function updateStatus(orderId: number, newStatus: Status) {
    setUpdating(orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    setChangedIds(prev => new Set([...prev, orderId]))
    setTimeout(() => setChangedIds(prev => { const s = new Set(prev); s.delete(orderId); return s }), 500)
    try {
      await adminClient.patch(`/orders/${orderId}/status`, { status: newStatus })
      if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
        setTimeout(() => setOrders(prev => prev.filter(o => o.id !== orderId)), 1200)
      }
    } catch { load() }
    finally { setUpdating(null) }
  }

  // 요약 집계 — 전체 주문 기준 (완료/취소 포함)
  const activeTables = new Set(orders.map(o => o.tableId)).size
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
  }
  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount), 0)

  const displayed = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  const summaryCards = [
    { key: 'ALL',       label: '활성 테이블', value: activeTables, icon: '🪑', color: 'var(--accent)' },
    { key: 'PENDING',   label: '대기중',      value: counts.PENDING,   icon: '⏳', color: 'var(--status-pending-text)',   highlight: counts.PENDING > 0 },
    { key: 'PREPARING', label: '준비중',      value: counts.PREPARING, icon: '🍳', color: 'var(--status-preparing-text)' },
    { key: 'COMPLETED', label: '완료',        value: counts.COMPLETED, icon: '✅', color: 'var(--status-completed-text)' },
    { key: 'CANCELLED', label: '취소됨',      value: counts.CANCELLED, icon: '❌', color: '#888' },
    { key: '_revenue',  label: '총 매출',     value: totalRevenue.toLocaleString('ko-KR') + '원', icon: '💰', color: 'var(--warning)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder 관리자</span>
        <div className="navbar-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/tables')}>테이블 관리</button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/menus')}>메뉴 관리</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { clearAuth(); navigate('/admin/login') }}>로그아웃</button>
        </div>
      </nav>

      <div className="page">
        {/* 요약 카드 — 클릭 시 필터 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 20 }}>
          {summaryCards.map(s => {
            const isActive = filter === s.key
            const clickable = s.key !== '_revenue'
            return (
              <div key={s.key} className="card"
                onClick={() => clickable && setFilter(isActive ? 'ALL' : s.key as Status | 'ALL')}
                style={{
                  borderTop: `3px solid ${s.color}`,
                  background: s.highlight ? 'var(--status-pending-bg)' : isActive ? '#f0f7ff' : undefined,
                  cursor: clickable ? 'pointer' : 'default',
                  outline: isActive ? `2px solid ${s.color}` : 'none',
                  transition: 'all 0.2s',
                }}>
                <div className="card-body" style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>
            주문 목록 {filter !== 'ALL' && <span style={{ color: STATUS_TEXT[filter], fontSize: 13 }}>— {STATUS_LABEL[filter]}</span>}
          </h2>
          {counts.PENDING > 0 && (
            <span style={{ fontSize: 12, color: 'var(--status-pending-text)', fontWeight: 700, animation: 'pulse 1.5s infinite' }}>
              ● 대기 {counts.PENDING}건
            </span>
          )}
        </div>

        {displayed.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">해당 주문이 없습니다</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {displayed.map(order => (
              <div key={order.id}
                className={`card ${newIds.has(order.id) ? 'new-order' : ''}`}
                style={{
                  borderLeft: `4px solid ${STATUS_TEXT[order.status]}`,
                  opacity: (order.status === 'COMPLETED' || order.status === 'CANCELLED') ? 0.65 : 1,
                  transition: 'border-color 0.4s, opacity 0.5s',
                }}>
                {/* 주문 행 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <span className={changedIds.has(order.id) ? 'status-changed' : ''}
                    style={{
                      background: STATUS_BG[order.status], color: STATUS_TEXT[order.status],
                      border: `1px solid ${STATUS_BORDER[order.status]}`,
                      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10,
                      minWidth: 52, textAlign: 'center', transition: 'all 0.3s',
                    }}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13, minWidth: 64 }}>주문 #{order.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 68 }}>
                    🪑 테이블 {tableMap.get(order.tableId) ?? order.tableId}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.items?.map(i => `${i.menuName}×${i.quantity}`).join(', ')}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 13, minWidth: 76, textAlign: 'right' }}>
                    {Number(order.totalAmount).toLocaleString('ko-KR')}원
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 120, textAlign: 'right' }}>
                    {formatFull(order.createdAt)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{expanded === order.id ? '▲' : '▼'}</span>
                </div>

                {/* 상세 */}
                {expanded === order.id && (
                  <div className="slide-in" style={{ borderTop: '1px solid var(--border)', padding: '12px 14px', background: '#fafbfc' }}>
                    {order.items?.map((item, j) => (
                      <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0', borderBottom: j < (order.items?.length ?? 0) - 1 ? '1px solid var(--border)' : 'none' }}>
                        <span>{item.menuName} × {item.quantity}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{(Number(item.unitPrice) * item.quantity).toLocaleString('ko-KR')}원</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                        합계 {Number(order.totalAmount).toLocaleString('ko-KR')}원
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {order.status === 'PENDING' && (
                          <>
                            <button disabled={updating === order.id}
                              onClick={e => { e.stopPropagation(); updateStatus(order.id, 'PREPARING') }}
                              style={{ background: 'var(--status-preparing-text)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                              {updating === order.id ? '...' : '준비 시작'}
                            </button>
                            <button disabled={updating === order.id}
                              onClick={e => { e.stopPropagation(); updateStatus(order.id, 'CANCELLED') }}
                              style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                              취소
                            </button>
                          </>
                        )}
                        {order.status === 'PREPARING' && (
                          <button disabled={updating === order.id}
                            onClick={e => { e.stopPropagation(); updateStatus(order.id, 'COMPLETED') }}
                            style={{ background: 'var(--status-completed-text)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                            {updating === order.id ? '...' : '완료 처리'}
                          </button>
                        )}
                        {(order.status === 'COMPLETED') && <span style={{ fontSize: 12, color: 'var(--status-completed-text)', fontWeight: 700 }}>✓ 완료</span>}
                        {(order.status === 'CANCELLED') && <span style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>✕ 취소됨</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
