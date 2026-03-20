import { CartItem } from '../types'

const CART_KEY = 'tableorder_cart'

export function useCart() {
  function getCart(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    } catch {
      return []
    }
  }

  function saveCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }

  function addItem(item: Omit<CartItem, 'quantity'>) {
    const cart = getCart()
    const existing = cart.find(c => c.menuId === item.menuId)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...item, quantity: 1 })
    }
    saveCart(cart)
  }

  function removeItem(menuId: number) {
    saveCart(getCart().filter(c => c.menuId !== menuId))
  }

  function updateQuantity(menuId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuId)
      return
    }
    const cart = getCart()
    const item = cart.find(c => c.menuId === menuId)
    if (item) {
      item.quantity = quantity
      saveCart(cart)
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY)
  }

  function getTotalAmount(): number {
    return getCart().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }

  return { getCart, addItem, removeItem, updateQuantity, clearCart, getTotalAmount }
}
