import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminClient from '../../api/adminClient'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { Menu } from '../../types'

interface MenuForm { name: string; price: string; description: string; categoryId: string }
const EMPTY_FORM: MenuForm = { name: '', price: '', description: '', categoryId: '1' }

const CATEGORY_NAMES: Record<number, string> = { 1: '☕ 커피', 2: '🥤 음료', 3: '🍰 디저트' }

export default function MenuManagePage() {
  const navigate = useNavigate()
  const { getStoreId } = useAdminAuth()
  const [menus, setMenus] = useState<Menu[]>([])
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterCat, setFilterCat] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const storeId = getStoreId()

  useEffect(() => { loadMenus() }, [])

  async function loadMenus() {
    const res = await adminClient.get<Menu[]>(`/menus?storeId=${storeId}`)
    setMenus(res.data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = new FormData()
    data.append('name', form.name); data.append('price', form.price)
    data.append('description', form.description); data.append('categoryId', form.categoryId)
    if (fileRef.current?.files?.[0]) data.append('image', fileRef.current.files[0])
    if (editingId) {
      await adminClient.put(`/menus/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await adminClient.post('/menus', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); loadMenus()
  }

  async function handleDelete(menuId: number) {
    if (!window.confirm('메뉴를 삭제하시겠습니까?')) return
    await adminClient.delete(`/menus/${menuId}`); loadMenus()
  }

  function startEdit(menu: Menu) {
    setForm({ name: menu.name, price: String(menu.price), description: menu.description || '', categoryId: String(menu.categoryId) })
    setEditingId(menu.id); setShowForm(true)
  }

  const filtered = filterCat ? menus.filter(m => m.categoryId === filterCat) : menus
  const categories = Array.from(new Set(menus.map(m => m.categoryId)))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-brand">🍽️ TableOrder 관리자</span>
        <div className="navbar-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/dashboard')}>← 대시보드</button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/tables')}>테이블 관리</button>
        </div>
      </nav>
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 className="page-title" style={{ margin: 0 }}>🍽️ 메뉴 관리</h1>
          <button className="btn btn-primary" data-testid="menu-create-button"
            onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}>
            + 메뉴 추가
          </button>
        </div>

        <div className="tabs">
          <button className={`tab ${!filterCat ? 'active' : ''}`} onClick={() => setFilterCat(null)}>전체 ({menus.length})</button>
          {categories.map(id => (
            <button key={id} className={`tab ${filterCat === id ? 'active' : ''}`} onClick={() => setFilterCat(id)}>
              {CATEGORY_NAMES[id] || `카테고리 ${id}`} ({menus.filter(m => m.categoryId === id).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-state-icon">🍽️</div><div className="empty-state-text">메뉴가 없습니다</div></div></div>
        ) : (
          <div className="card">
            <table className="table">
              <thead><tr><th>메뉴명</th><th>카테고리</th><th>가격</th><th>설명</th><th>관리</th></tr></thead>
              <tbody>
                {filtered.map(menu => (
                  <tr key={menu.id}>
                    <td style={{ fontWeight: 600 }}>{menu.name}</td>
                    <td><span className="badge" style={{ background: 'var(--bg)', color: 'var(--text)' }}>{CATEGORY_NAMES[menu.categoryId] || menu.categoryId}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{Number(menu.price).toLocaleString()}원</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 200 }}>{menu.description || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" data-testid={`menu-edit-button-${menu.id}`} onClick={() => startEdit(menu)}>수정</button>
                        <button className="btn btn-danger btn-sm" data-testid={`menu-delete-button-${menu.id}`} onClick={() => handleDelete(menu.id)}>삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editingId ? '메뉴 수정' : '메뉴 추가'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">메뉴명 *</label>
                  <input className="form-input" data-testid="menu-form-name" placeholder="예: 아메리카노"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">가격 *</label>
                  <input className="form-input" data-testid="menu-form-price" type="number" placeholder="예: 4500"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">카테고리 *</label>
                  <select className="form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="1">☕ 커피</option>
                    <option value="2">🥤 음료</option>
                    <option value="3">🍰 디저트</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">설명</label>
                  <input className="form-input" placeholder="메뉴 설명"
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">이미지</label>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="form-input" style={{ padding: '10px 12px' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>취소</button>
                <button type="submit" className="btn btn-primary" data-testid="menu-form-submit">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
