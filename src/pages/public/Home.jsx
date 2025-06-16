import { Link } from "react-router-dom"
import { Calendar, Clock, Shield, Users } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento Online",
      description: "Agende suas consultas de forma rápida e prática, 24 horas por dia.",
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Diversos horários disponíveis para atender sua agenda.",
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Seus dados estão protegidos com a mais alta segurança.",
    },
    {
      icon: Users,
      title: "Equipe Qualificada",
      description: "Profissionais experientes e especializados.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cuidando da sua saúde com
              <span className="block text-primary-200">tecnologia e carinho</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Agende suas consultas médicas de forma simples e rápida. Nossa plataforma conecta você aos melhores
              profissionais de saúde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agendar"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Agendar Consulta
              </Link>
              <Link
                to="/login"
                className="btn border-2 border-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
              >
                Área do Profissional
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher nossa plataforma?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em agendamento médico com tecnologia de ponta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pronto para cuidar da sua saúde?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende sua consulta agora mesmo e tenha acesso aos melhores profissionais de saúde
          </p>
          <Link to="/agendar" className="btn btn-primary px-8 py-3 text-lg font-semibold">
            Agendar Agora
          </Link>
        </div>
      </section>
    </div>
  )
}
