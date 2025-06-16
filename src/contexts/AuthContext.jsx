"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("@medical:token")

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadUser() {
    try {
      const response = await api.get("/auth/me")
      setUser(response.data.user)
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      localStorage.removeItem("@medical:token")
      delete api.defaults.headers.authorization
    } finally {
      setLoading(false)
    }
  }

  async function signIn({ email, senha }) {
    try {
      const response = await api.post("/auth/login", { email, senha })

      const { token, user: userData } = response.data

      localStorage.setItem("@medical:token", token)
      api.defaults.headers.authorization = `Bearer ${token}`

      setUser(userData)
      console.log("Usuário autenticado:", userData)

      toast.success("Login realizado com sucesso!")

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao fazer login"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  async function signUp(userData) {
    try {
      await api.post("/auth/register", userData)
      toast.success("Usuário criado com sucesso!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao criar usuário"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  function signOut() {
    localStorage.removeItem("@medical:token")
    delete api.defaults.headers.authorization
    setUser(null)
    toast.success("Logout realizado com sucesso!")
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
