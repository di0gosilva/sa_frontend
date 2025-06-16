"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Clock, Plus, Edit, Trash2 } from "lucide-react"

export default function Schedules() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const daysOfWeek = [
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ]

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      const response = await api.get("/schedules")
      setSchedules(response.data)
    } catch (error) {
      toast.error("Erro ao carregar horários")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const scheduleData = {
        ...data,
        diaSemana: Number.parseInt(data.diaSemana),
      }

      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, scheduleData)
        toast.success("Horário atualizado com sucesso")
      } else {
        await api.post("/schedules", scheduleData)
        toast.success("Horário criado com sucesso")
      }

      setShowForm(false)
      setEditingSchedule(null)
      reset()
      loadSchedules()
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao salvar horário"
      toast.error(message)
    }
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    reset({
      diaSemana: schedule.diaSemana,
      horaInicio: schedule.horaInicio,
      horaFim: schedule.horaFim,
    })
    setShowForm(true)
  }

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Tem certeza que deseja deletar este horário?")) {
      return
    }

    try {
      await api.delete(`/schedules/${scheduleId}`)
      toast.success("Horário deletado com sucesso")
      loadSchedules()
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao deletar horário"
      toast.error(message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSchedule(null)
    reset()
  }

  const getDayName = (dayNumber) => {
    const day = daysOfWeek.find((d) => d.value === dayNumber)
    return day ? day.label : "Domingo"
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
          <h1 className="text-2xl font-bold text-gray-900">Meus Horários</h1>
          <p className="text-gray-600">Gerencie seus horários de atendimento</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Horário</span>
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{editingSchedule ? "Editar Horário" : "Novo Horário"}</h3>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dia da Semana *</label>
                  <select
                    {...register("diaSemana", {
                      required: "Selecione um dia da semana",
                    })}
                    className="input mt-1"
                  >
                    <option value="">Selecione um dia</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  {errors.diaSemana && <p className="mt-1 text-sm text-red-600">{errors.diaSemana.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora Início *</label>
                  <input
                    {...register("horaInicio", {
                      required: "Hora de início é obrigatória",
                    })}
                    type="time"
                    className="input mt-1"
                  />
                  {errors.horaInicio && <p className="mt-1 text-sm text-red-600">{errors.horaInicio.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora Fim *</label>
                  <input
                    {...register("horaFim", {
                      required: "Hora de fim é obrigatória",
                    })}
                    type="time"
                    className="input mt-1"
                  />
                  {errors.horaFim && <p className="mt-1 text-sm text-red-600">{errors.horaFim.message}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? "Atualizar" : "Criar"} Horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Horários */}
      <div className="card">
        <div className="card-content">
          {schedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dia da Semana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{getDayName(schedule.diaSemana)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {schedule.horaInicio} às {schedule.horaFim}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum horário cadastrado</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                Criar Primeiro Horário
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
