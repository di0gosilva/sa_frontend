"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { api } from "../../services/api"
import toast from "react-hot-toast"
import { Calendar, User } from "lucide-react"
import { format, addDays, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchedDoctor = watch("medicoId")
  const watchedDate = watch("data")

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    if (watchedDoctor && watchedDate) {
      loadAvailableSlots(watchedDoctor, watchedDate)
    } else {
      setAvailableSlots([])
    }
  }, [watchedDoctor, watchedDate])

  const loadDoctors = async () => {
    try {
      const response = await api.get("/public/doctors")
      setDoctors(response.data)
    } catch (error) {
      toast.error("Erro ao carregar médicos")
    }
  }

  const loadAvailableSlots = async (doctorId, date) => {
    setLoadingSlots(true)
    try {
      const response = await api.get(`/public/doctors/${doctorId}/availability`, {
        params: { date },
      })
      setAvailableSlots(response.data.availableSlots)
    } catch (error) {
      toast.error("Erro ao carregar horários disponíveis")
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      await api.post("/public/appointments", data)
      toast.success("Consulta agendada com sucesso! Verifique seu email.")

      // Reset form
      window.location.reload()
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao agendar consulta"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Gerar próximos 30 dias (excluindo domingos)
  const getAvailableDates = () => {
    const dates = []
    const today = startOfDay(new Date())

    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i)
      // Excluir domingos (0 = domingo)
      if (date.getDay() !== 0) {
        dates.push(date)
      }
    }

    return dates
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
          <p className="mt-2 text-gray-600">Preencha os dados abaixo para agendar sua consulta</p>
        </div>

        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados do Paciente */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Dados do Paciente
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
                  <input
                    {...register("nomePaciente", {
                      required: "Nome é obrigatório",
                      minLength: {
                        value: 2,
                        message: "Nome deve ter pelo menos 2 caracteres",
                      },
                    })}
                    type="text"
                    className="input mt-1"
                    placeholder="Seu nome completo"
                  />
                  {errors.nomePaciente && <p className="mt-1 text-sm text-red-600">{errors.nomePaciente.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    {...register("emailPaciente", {
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
                  {errors.emailPaciente && <p className="mt-1 text-sm text-red-600">{errors.emailPaciente.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input {...register("telefone")} type="tel" className="input mt-1" placeholder="(11) 99999-9999" />
                </div>
              </div>

              {/* Seleção do Médico */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Médico
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Selecione o Médico *</label>
                  <select
                    {...register("medicoId", {
                      required: "Selecione um médico",
                    })}
                    className="input mt-1"
                  >
                    <option value="">Selecione um médico</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.nome} - {doctor.especialidade || "Clínico Geral"}
                      </option>
                    ))}
                  </select>
                  {errors.medicoId && <p className="mt-1 text-sm text-red-600">{errors.medicoId.message}</p>}
                </div>
              </div>

              {/* Seleção de Data e Hora */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Data e Horário
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data da Consulta *</label>
                  <select
                    {...register("data", {
                      required: "Selecione uma data",
                    })}
                    className="input mt-1"
                    disabled={!watchedDoctor}
                  >
                    <option value="">{!watchedDoctor ? "Selecione um médico primeiro" : "Selecione uma data"}</option>
                    {getAvailableDates().map((date) => (
                      <option key={date.toISOString()} value={format(date, "yyyy-MM-dd")}>
                        {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </option>
                    ))}
                  </select>
                  {errors.data && <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Horário *</label>
                  {loadingSlots ? (
                    <div className="mt-1 p-3 border rounded-md text-center text-gray-500">Carregando horários...</div>
                  ) : availableSlots.length > 0 ? (
                    <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <label key={slot} className="relative">
                          <input
                            {...register("hora", {
                              required: "Selecione um horário",
                            })}
                            type="radio"
                            value={slot}
                            className="sr-only peer"
                          />
                          <div className="p-2 text-center border rounded-md cursor-pointer peer-checked:bg-primary-600 peer-checked:text-white peer-checked:border-primary-600 hover:border-primary-300">
                            {slot}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : watchedDoctor && watchedDate ? (
                    <div className="mt-1 p-3 border rounded-md text-center text-gray-500">
                      Nenhum horário disponível para esta data
                    </div>
                  ) : (
                    <div className="mt-1 p-3 border rounded-md text-center text-gray-500">
                      Selecione um médico e uma data para ver os horários
                    </div>
                  )}
                  {errors.hora && <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || availableSlots.length === 0}
                  className="btn btn-primary w-full py-3 text-base font-medium disabled:opacity-50"
                >
                  {loading ? "Agendando..." : "Agendar Consulta"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Após o agendamento, você receberá um email de confirmação e um lembrete 24 horas antes da consulta.</p>
        </div>
      </div>
    </div>
  )
}
