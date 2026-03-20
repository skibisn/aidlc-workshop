import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import LoginPage from '../../admin/pages/LoginPage'
import adminClient from '../../api/adminClient'

vi.mock('../../api/adminClient')

describe('LoginPage (Admin)', () => {
  beforeEach(() => localStorage.clear())

  it('로그인 폼이 렌더링된다', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByTestId('login-store-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-username-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-submit-button')).toBeInTheDocument()
  })

  it('로그인 실패 시 에러 메시지 표시', async () => {
    vi.mocked(adminClient.post).mockRejectedValue(new Error('401'))
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    fireEvent.change(screen.getByTestId('login-store-input'), { target: { value: 'store-001' } })
    fireEvent.change(screen.getByTestId('login-username-input'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByTestId('login-password-input'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByTestId('login-submit-button'))
    await waitFor(() => expect(screen.getByText(/로그인에 실패/)).toBeInTheDocument())
  })
})
