"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { LayoutDashboard, Calendar, Clock, Users, User } from "lucide-react"

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["DOCTOR", "RECEPTIONIST"],
    },
    {
      name: "Consultas",
      href: "/dashboard/consultas",
      icon: Calendar,
      roles: ["DOCTOR"],
    },
    {
      name: "Horários",
      href: "/dashboard/horarios",
      icon: Clock,
      roles: ["RECEPTIONIST"],
    },
    {
      name: "Médicos",
      href: "/dashboard/medicos",
      icon: Users,
      roles: ["RECEPTIONIST"],
    },
    {
      name: "Perfil",
      href: "/dashboard/perfil",
      icon: User,
      roles: ["DOCTOR", "RECEPTIONIST"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role))

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-primary-100 text-primary-700 border-r-2 border-primary-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
