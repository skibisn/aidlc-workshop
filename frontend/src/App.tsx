import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSession } from './hooks/useSession'
import AdminApp from './admin/AdminApp'
import CartPage from './pages/CartPage'
import MenuPage from './pages/MenuPage'
import OrderConfirmPage from './pages/OrderConfirmPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import TableSetupPage from './pages/TableSetupPage'

function RequireSession({ children }: { children: React.ReactNode }) {
  const { getSession } = useSession()
  return getSession() ? <>{children}</> : <Navigate to="/setup" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<TableSetupPage />} />
        <Route path="/menu" element={<RequireSession><MenuPage /></RequireSession>} />
        <Route path="/cart" element={<RequireSession><CartPage /></RequireSession>} />
        <Route path="/order/confirm" element={<RequireSession><OrderConfirmPage /></RequireSession>} />
        <Route path="/orders" element={<RequireSession><OrderHistoryPage /></RequireSession>} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
