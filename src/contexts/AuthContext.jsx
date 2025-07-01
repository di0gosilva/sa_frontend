"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser() 
  }, [])

  async function loadUser() {
    try {
      const response = await api.get("/auth/me", {
        withCredentials: true,
      })
      setUser(response.data.user)
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function signIn({ email, senha }) {
    try {
      const response = await api.post(
        "/auth/login",
        { email, senha },
        { withCredentials: true },
      )

      setUser(response.data.user)
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

  async function signOut() {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true })
    } catch (e) {
      console.error("Erro ao fazer logout:", e)
    } finally {
      setUser(null)
      toast.success("Logout realizado com sucesso!")
    }
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
