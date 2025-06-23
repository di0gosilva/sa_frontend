"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"
import { Calendar, Clock, Users, CalendarDays, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      if (user.role === "DOCTOR") {
        const response = await api.get(`/doctors/${user.doctor.id}/dashboard`)
        setDashboardData(response.data)
      } else {
        // Para recepcionistas, carregar dados gerais
        const [appointmentsRes, doctorsRes] = await Promise.all([api.get("/appointments"), api.get("/doctors")])

        const today = new Date()
        const todayAppointments = appointmentsRes.data.filter((apt) => {
          const aptDate = new Date(apt.data)
          return aptDate.toDateString() === today.toDateString() && apt.status === "AGENDADA"
        })

        setDashboardData({
          consultasHoje: todayAppointments.length,
          totalMedicos: doctorsRes.data.length,
          proximasConsultas: appointmentsRes.data
            .filter((apt) => apt.status === "AGENDADA" && new Date(apt.data) >= today)
            .slice(0, 5),
          estatisticas: {
            agendadas: appointmentsRes.data.filter((apt) => apt.status === "AGENDADA").length,
            realizadas: appointmentsRes.data.filter((apt) => apt.status === "REALIZADA").length,
            canceladas: appointmentsRes.data.filter((apt) => apt.status === "CANCELADA").length,
          },
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: user.role === "DOCTOR" ? "Consultas Hoje" : "Consultas Hoje",
      value: dashboardData?.consultasHoje || 0,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: user.role === "DOCTOR" ? "Consultas Semana" : "Total Médicos",
      value: user.role === "DOCTOR" ? dashboardData?.consultasSemana || 0 : dashboardData?.totalMedicos || 0,
      icon: user.role === "DOCTOR" ? CalendarDays : Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      name: "Agendadas",
      value: dashboardData?.estatisticas?.agendadas || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      name: "Realizadas",
      value: dashboardData?.estatisticas?.realizadas || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, {user.nome}!</h1>
        <p className="text-gray-600">
          {user.role === "DOCTOR" ? "Gerencie suas consultas e horários" : "Painel administrativo da clínica"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Próximas Consultas */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Próximas Consultas</h3>
        </div>
        <div className="card-content">
          {dashboardData?.proximasConsultas?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.proximasConsultas.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.nomePaciente}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(appointment.data), "dd 'de' MMMM", { locale: ptBR })} às{" "}
                        {format(new Date(appointment.hora), "HH:mm")}
                      </p>
                      {user.role === "RECEPTIONIST" && (
                        <p className="text-sm text-gray-500">Dr(a). {appointment.medico?.nome}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === "AGENDADA"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "CANCELADA"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma consulta agendada</p>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      {dashboardData?.estatisticas && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Status das Consultas</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Agendadas</span>
                  </div>
                  <span className="font-medium">{dashboardData.estatisticas.agendadas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Realizadas</span>
                  </div>
                  <span className="font-medium">{dashboardData.estatisticas.realizadas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Canceladas</span>
                  </div>
                  <span className="font-medium">{dashboardData.estatisticas.canceladas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
