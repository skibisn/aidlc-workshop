import { beforeEach, describe, expect, it } from 'vitest'
import { useCart } from '../../hooks/useCart'

describe('useCart', () => {
  beforeEach(() => localStorage.clear())

  const cart = () => useCart()

  it('빈 장바구니 반환', () => {
    expect(cart().getCart()).toEqual([])
  })

  it('메뉴 추가', () => {
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    expect(cart().getCart()).toHaveLength(1)
    expect(cart().getCart()[0].quantity).toBe(1)
  })

  it('같은 메뉴 추가 시 수량 증가', () => {
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    expect(cart().getCart()[0].quantity).toBe(2)
  })

  it('수량 0 이하로 변경 시 항목 삭제', () => {
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    cart().updateQuantity(1, 0)
    expect(cart().getCart()).toHaveLength(0)
  })

  it('총액 계산', () => {
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    cart().updateQuantity(1, 2)
    expect(cart().getTotalAmount()).toBe(9000)
  })

  it('장바구니 비우기', () => {
    cart().addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
    cart().clearCart()
    expect(cart().getCart()).toHaveLength(0)
  })
})
