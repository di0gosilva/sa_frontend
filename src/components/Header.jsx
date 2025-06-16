"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Calendar, LogOut, User } from "lucide-react"

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MedicalApp</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/agendar"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Agendar Consulta
                </Link>
                <Link to="/login" className="btn btn-primary px-4 py-2">
                  Entrar
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user?.nome}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
