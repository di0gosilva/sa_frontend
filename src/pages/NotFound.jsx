"use client"

import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Página não encontrada</h2>
          <p className="text-gray-600 mt-2">A página que você está procurando não existe ou foi movida.</p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="btn btn-primary w-full flex items-center justify-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
