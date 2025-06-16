"use client"

import { Routes, Route } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

// Layouts
import PublicLayout from "./layouts/PublicLayout"
import PrivateLayout from "./layouts/PrivateLayout"

// Componentes de rota
import ProtectedRoute from "./components/ProtectedRoute"

// Páginas públicas
import Home from "./pages/public/Home"
import Login from "./pages/public/Login"
import BookAppointment from "./pages/public/BookAppointment"

// Páginas privadas
import Dashboard from "./pages/private/Dashboard"
import Appointments from "./pages/private/Appointments"
import Schedules from "./pages/private/Schedules"
import Doctors from "./pages/private/Doctors"
import Profile from "./pages/private/Profile"

// Páginas de erro
import NotFound from "./pages/NotFound"

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="agendar" element={<BookAppointment />} />
      </Route>

      {/* Rotas Privadas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="consultas" element={<Appointments />} />
        <Route
          path="horarios"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <Schedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="medicos"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route path="perfil" element={<Profile />} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
