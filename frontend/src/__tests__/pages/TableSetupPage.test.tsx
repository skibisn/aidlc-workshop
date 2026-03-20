import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TableSetupPage from '../../pages/TableSetupPage'
import client from '../../api/client'

vi.mock('../../api/client')

describe('TableSetupPage', () => {
  beforeEach(() => localStorage.clear())

  it('입력 폼이 렌더링된다', () => {
    render(<MemoryRouter><TableSetupPage /></MemoryRouter>)
    expect(screen.getByTestId('setup-store-input')).toBeInTheDocument()
    expect(screen.getByTestId('setup-table-input')).toBeInTheDocument()
    expect(screen.getByTestId('setup-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('setup-submit-button')).toBeInTheDocument()
  })

  it('로그인 실패 시 에러 메시지 표시', async () => {
    vi.mocked(client.post).mockRejectedValue(new Error('401'))
    render(<MemoryRouter><TableSetupPage /></MemoryRouter>)
    fireEvent.change(screen.getByTestId('setup-store-input'), { target: { value: 'store-001' } })
    fireEvent.change(screen.getByTestId('setup-table-input'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('setup-password-input'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByTestId('setup-submit-button'))
    await waitFor(() => expect(screen.getByText(/로그인에 실패/)).toBeInTheDocument())
  })
})
