import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useCart } from '../hooks/useCart'
import { useSession } from '../hooks/useSession'
import { Category, Menu } from '../types'

const DEMO_MENUS: Menu[] = [
  { id: 1, categoryId: 1, name: '아메리카노', price: 4500, description: '진한 에스프레소와 물의 조화', sortOrder: 1 },
  { id: 2, categoryId: 1, name: '카페라떼', price: 5000, description: '에스프레소와 스팀 밀크', sortOrder: 2 },
  { id: 3, categoryId: 1, name: '카푸치노', price: 5000, description: '에스프레소와 우유 거품', sortOrder: 3 },
  { id: 4, categoryId: 2, name: '녹차라떼', price: 5500, description: '말차 파우더와 스팀 밀크', sortOrder: 1 },
  { id: 5, categoryId: 2, name: '자몽에이드', price: 5500, description: '상큼한 자몽 에이드', sortOrder: 2 },
  { id: 6, categoryId: 3, name: '치즈케이크', price: 6500, description: '부드러운 뉴욕 치즈케이크', sortOrder: 1 },
  { id: 7, categoryId: 3, name: '티라미수', price: 6500, description: '이탈리안 정통 티라미수', sortOrder: 2 },
]
const DEMO_CATS: Category[] = [
  { id: 1, name: '☕ 커피', sortOrder: 1 },
  { id: 2, name: '🥤 음료', sortOrder: 2 },
  { id: 3, name: '🍰 디저트', sortOrder: 3 },
]
const MENU_EMOJI: Record<number, string> = { 1: '☕', 2: '☕', 3: '☕', 4: '🍵', 5: '🍊', 6: '🍰', 7: '🍮' }

export default function MenuPage() {
  const navigate = useNavigate()
  const { getSession } = useSession()
  const { addItem, getCart } = useCart()
  const [menus, setMenus] = useState<Menu[]>(DEMO_MENUS)
  const [categories] = useState<Category[]>(DEMO_CATS)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [added, setAdded] = useState<number | null>(null)
  const session = getSession()

  useEffect(() => {
    if (!session) { navigate('/setup'); return }
    client.get<Menu[]>(`/menus?storeId=${session.storeId}`)
      .then(res => { if (res.data.length > 0) setMenus(res.data) })
      .catch(() => {})
  }, [])

  function handleAdd(menu: Menu) {
    addItem({ menuId: menu.id, menuName: menu.name, unitPrice: menu.price })
    setAdded(menu.id)
    setTimeout(() => setAdded(null), 800)
  }

  const filtered = selectedCategoryId ? menus.filter(m => m.categoryId === selectedCategoryId) : menus
  const cartCount = getCart().reduce((s, i) => s + i.quantity, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder</span>
        <div className="navbar-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}>📋 주문내역</button>
          <button className="btn btn-primary btn-sm" data-testid="cart-button" onClick={() => navigate('/cart')}
            style={{ position: 'relative' }}>
            🛒 장바구니 {cartCount > 0 && <span style={{ background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      <div className="page">
        <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          테이블 {session?.tableId} · 세션 활성
        </div>
        <h1 className="page-title">메뉴</h1>

        <div className="tabs">
          <button className={`tab ${!selectedCategoryId ? 'active' : ''}`}
            data-testid="category-tab-all" onClick={() => setSelectedCategoryId(null)}>전체</button>
          {categories.map(c => (
            <button key={c.id} className={`tab ${selectedCategoryId === c.id ? 'active' : ''}`}
              data-testid={`category-tab-${c.id}`} onClick={() => setSelectedCategoryId(c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid-3">
          {filtered.map(menu => (
            <div key={menu.id} className="card" data-testid={`menu-card-${menu.id}`}
              style={{ transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}>
              <div style={{ height: 120, background: 'linear-gradient(135deg, #232f3e, #37475a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                {MENU_EMOJI[menu.id] || '🍽️'}
              </div>
              <div className="card-body" style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{menu.name}</div>
                {menu.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{menu.description}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>{menu.price.toLocaleString()}원</span>
                  <button className="btn btn-primary btn-sm" data-testid={`menu-add-button-${menu.id}`}
                    onClick={() => handleAdd(menu)}
                    style={{ background: added === menu.id ? 'var(--success)' : undefined }}>
                    {added === menu.id ? '✓ 추가됨' : '+ 담기'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
