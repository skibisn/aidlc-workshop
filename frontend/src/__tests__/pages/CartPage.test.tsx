import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import CartPage from '../../pages/CartPage'
import { useCart } from '../../hooks/useCart'

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear()
    const { addItem } = useCart()
    addItem({ menuId: 1, menuName: '아메리카노', unitPrice: 4500 })
  })

  it('장바구니 항목과 총액이 표시된다', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>)
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent('4,500')
  })

  it('수량 증가 버튼 클릭 시 총액 변경', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('quantity-increase-1'))
    expect(screen.getByTestId('cart-total')).toHaveTextContent('9,000')
  })

  it('삭제 버튼 클릭 시 항목 제거', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('cart-delete-1'))
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument()
  })
})
