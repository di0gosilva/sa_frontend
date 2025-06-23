import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
})

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sessão expirada ou acesso não autorizado.")
    }

    return Promise.reject(error)
  },
)
