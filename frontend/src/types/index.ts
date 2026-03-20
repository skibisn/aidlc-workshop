export interface Menu {
  id: number
  categoryId: number
  name: string
  price: number
  description?: string
  imagePath?: string
  sortOrder: number
}

export interface Category {
  id: number
  name: string
  sortOrder: number
}

export interface CartItem {
  menuId: number
  menuName: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: number
  tableId: number
  sessionId: string
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED'
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  menuName: string
  quantity: number
  unitPrice: number
}

export interface OrderHistory {
  id: number
  sessionId: string
  completedAt: string
  totalAmount: number
}

export interface SessionInfo {
  storeId: number
  tableId: number
  sessionId: string
}
