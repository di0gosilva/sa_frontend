import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
})

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("@medical:token")
      delete api.defaults.headers.authorization
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)
