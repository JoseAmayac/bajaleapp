import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { MealsPage } from './pages/MealsPage'
import { ActivityPage } from './pages/ActivityPage'
import { MeasurementsPage } from './pages/MeasurementsPage'
import { ProfilePage } from './pages/ProfilePage'
import { AppLayout } from './components/AppLayout'

function ProtectedRoutes() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl animate-pulse">⚖️</div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return (
    <AppLayout />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/comidas" element={<MealsPage />} />
          <Route path="/actividad" element={<ActivityPage />} />
          <Route path="/medidas" element={<MeasurementsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
