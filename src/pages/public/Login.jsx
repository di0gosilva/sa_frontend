"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext"
import { Eye, EyeOff, Calendar } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState("login") // Adiciona estado para controle de abas
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm()

  const selectedRole = watch("role")

  const handleLogin = async (data) => {
    setLoading(true)
    const result = await signIn(data)
    if (result.success) {
      navigate(from, { replace: true })
    }
    setLoading(false)
  }

  const handleRegister = async (data) => {
    setLoading(true)

    const payload = { ...data }

    if (payload.role !== "DOCTOR") {
      delete payload.crm
    }

    const result = await signUp(payload)

    if (result.success) {
      setTab("login")
      reset()
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {tab === "login" ? "Faça login em sua conta" : "Crie uma conta"}
          </h2>
          {tab === "login" && (
            <p className="mt-2 text-sm text-gray-600">
              Ou{" "}
              <Link to="/agendar" className="font-medium text-primary-600 hover:text-primary-500">
                agende uma consulta sem login
              </Link>
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            className={`w-1/2 py-2 text-sm font-medium transition-colors ${
              tab === "login" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium transition-colors ${
              tab === "register" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("register")}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulários */}
        {tab === "login" ? (
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
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
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <div className="relative mt-1">
                  <input
                    {...register("senha", {
                      required: "Senha é obrigatória",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
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
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.senha && <p className="text-sm text-red-600">{errors.senha.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Testes:</p>
              <p><strong>Médico:</strong> admin@medico.com</p>
              <p><strong>Recepcionista:</strong> admin@recepcao.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className="input mt-1"
                  placeholder="Seu nome"
                />
                {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
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
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })}
                  type="password"
                  className="input mt-1"
                  placeholder="Crie uma senha"
                />
                {errors.senha && <p className="text-sm text-red-600">{errors.senha.message}</p>}
              </div>

              {
                selectedRole === "DOCTOR" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CRM</label>
                    <input
                      {...register("crm", {
                        required: "CRM é obrigatório",
                      })}
                      type="text"
                      className="input mt-1"
                      placeholder="123456-SP"
                    />
                    {errors.crm && <p className="text-sm text-red-600">{errors.crm.message}</p>}
                  </div>
                )
              }

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de usuário</label>
                <select
                  {...register("role", { required: "Selecione um tipo de usuário" })}
                  className="input mt-1"
                >
                  <option value="">Selecione</option>
                  <option value="RECEPTIONIST">Recepcionista</option>
                  <option value="DOCTOR">Médico</option>
                </select>
                {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
