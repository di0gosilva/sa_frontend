"use client"

import { useState, useEffect } from "react"
import { api } from "../../services/api"
import toast from "react-hot-toast"
import { Users, Mail, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      const response = await api.get("/doctors")
      setDoctors(response.data)
    } catch (error) {
      toast.error("Erro ao carregar médicos")
    } finally {
      setLoading(false)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
        <p className="text-gray-600">Lista de todos os médicos da clínica</p>
      </div>

      {/* Lista de Médicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card">
            <div className="card-content">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{doctor.nome}</h3>
                  <p className="text-sm text-gray-600">{doctor.especialidade || "Clínico Geral"}</p>
                  <p className="text-sm text-gray-500">CRM: {doctor.crm}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {doctor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {doctor.consultasAgendadas} consultas agendadas
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Cadastrado em {format(new Date(doctor.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum médico cadastrado</p>
        </div>
      )}
    </div>
  )
}
