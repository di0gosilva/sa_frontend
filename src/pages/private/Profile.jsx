"use client"
import { useAuth } from "../../contexts/AuthContext"
import { User, Mail, Shield, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Profile() {
  const { user } = useAuth()

  const getRoleLabel = (role) => {
    switch (role) {
      case "DOCTOR":
        return "Médico"
      case "RECEPTIONIST":
        return "Recepcionista"
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Informações da sua conta</p>
      </div>

      {/* Informações do Usuário */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Informações Pessoais</h3>
        </div>
        <div className="card-content">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">{user.nome}</h3>
                <p className="text-gray-600">{getRoleLabel(user.role)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de Conta</p>
                    <p className="text-sm text-gray-900">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Membro desde</p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações específicas do médico */}
              {user.role === "DOCTOR" && user.doctor && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Especialidade</p>
                    <p className="text-sm text-gray-900">{user.doctor.especialidade || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">CRM</p>
                    <p className="text-sm text-gray-900">{user.doctor.crm}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas (se for médico) */}
      {user.role === "DOCTOR" && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Estatísticas</h3>
          </div>
          <div className="card-content">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Estatísticas detalhadas disponíveis no Dashboard</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
