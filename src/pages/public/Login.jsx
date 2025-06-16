"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext"
import { Eye, EyeOff, Calendar } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
  
    const result = await signIn(data)
  
    if (result.success) {
      console.log("Redirecionando para:", from)
      navigate("/dashboard", { replace: true }) // Força dashboard fixo
    }
  
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Faça login em sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link to="/agendar" className="font-medium text-primary-600 hover:text-primary-500">
              agende uma consulta sem login
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                type="email"
                className="input mt-1"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.senha && <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">Dados de teste:</p>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>
                <strong>Médico:</strong> joao.silva@clinica.com
              </p>
              <p>
                <strong>Recepcionista:</strong> ana.recepcao@clinica.com
              </p>
              <p>
                <strong>Senha:</strong> password123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
