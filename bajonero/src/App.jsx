import { Routes, Route, Navigate } from 'react-router-dom'
import MenuPage from './pages/MenuPage.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import PrivateRoute from './components/admin/PrivateRoute.jsx'
import TrackingPage from './pages/TrackingPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/seguimiento/:orderId" element={<TrackingPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
