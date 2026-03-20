import { Navigate, Route, Routes } from 'react-router-dom'
import { useAdminAuth } from './hooks/useAdminAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TableManagePage from './pages/TableManagePage'
import MenuManagePage from './pages/MenuManagePage'

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  return isAuthenticated() ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>} />
      <Route path="tables" element={<RequireAdmin><TableManagePage /></RequireAdmin>} />
      <Route path="menus" element={<RequireAdmin><MenuManagePage /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}
