"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"
import toast from "react-hot-toast"
import { Calendar, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    search: "",
  })

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, filters])

  const loadAppointments = async () => {
    try {
      const response = await api.get("/appointments")
      setAppointments(response.data)
    } catch (error) {
      toast.error("Erro ao carregar consultas")
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = [...appointments]

    if (filters.status) {
      filtered = filtered.filter((apt) => apt.status === filters.status)
    }

    if (filters.date) {
      filtered = filtered.filter((apt) => {
        const aptDate = format(new Date(apt.data), "yyyy-MM-dd")
        return aptDate === filters.date
      })
    }

    if (filters.search) {
      filtered = filtered.filter(
        (apt) =>
          apt.nomePaciente.toLowerCase().includes(filters.search.toLowerCase()) ||
          apt.emailPaciente.toLowerCase().includes(filters.search.toLowerCase()) ||
          (apt.medico?.nome && apt.medico.nome.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus })
      toast.success("Status atualizado com sucesso")
      loadAppointments()
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao atualizar status"
      toast.error(message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      return
    }

    try {
      await api.delete(`/appointments/${appointmentId}`)
      toast.success("Consulta cancelada com sucesso")
      loadAppointments()
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao cancelar consulta"
      toast.error(message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "AGENDADA":
        return "bg-yellow-100 text-yellow-800"
      case "REALIZADA":
        return "bg-green-100 text-green-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "AGENDADA":
        return <Clock className="h-4 w-4" />
      case "REALIZADA":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELADA":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">
            {user.role === "DOCTOR" ? "Suas consultas agendadas" : "Todas as consultas da clínica"}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nome do paciente..."
                  className="input pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Todos os status</option>
                <option value="AGENDADA">Agendada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                className="input"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: "", date: "", search: "" })}
                className="btn btn-secondary w-full"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Consultas */}
      <div className="card">
        <div className="card-content">
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    {user.role === "RECEPTIONIST" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médico
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{appointment.nomePaciente}</div>
                          <div className="text-sm text-gray-500">{appointment.emailPaciente}</div>
                          {appointment.telefone && <div className="text-sm text-gray-500">{appointment.telefone}</div>}
                        </div>
                      </td>
                      {user.role === "RECEPTIONIST" && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.medico?.nome}</div>
                          <div className="text-sm text-gray-500">{appointment.medico?.especialidade}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(appointment.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        <div className="text-sm text-gray-500">{format(new Date(appointment.hora), "HH:mm")}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {appointment.status === "AGENDADA" && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, "REALIZADA")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Marcar como Realizada
                            </button>
                            {user.role === "RECEPTIONIST" && (
                              <button
                                onClick={() => cancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900 ml-2"
                              >
                                Cancelar
                              </button>
                            )}
                          </>
                        )}
                        {appointment.status === "REALIZADA" && user.role === "DOCTOR" && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, "AGENDADA")}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Reagendar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma consulta encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
