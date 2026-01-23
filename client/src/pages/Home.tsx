import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, TrendingUp, Shield, Zap } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

const features = [
  {
    icon: Briefcase,
    title: 'Выпуск облигаций',
    description: 'Привлечение капитала от 100 млн ₽ без залога',
    color: 'bg-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Крипто-карта',
    description: 'Принимайте криптоплатежи с полным комплаенсом',
    color: 'bg-purple-500',
  },
  {
    icon: Shield,
    title: 'Анализ деятельности',
    description: 'Кредитный профиль и стресс-тесты',
    color: 'bg-green-500',
  },
  {
    icon: Zap,
    title: 'Консалтинг',
    description: 'Финансовые решения под ваши задачи',
    color: 'bg-orange-500',
  },
]

export default function Home() {
  const { isTelegram, user } = useTelegram()

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            {isTelegram && user && (
              <p className="text-primary-200 mb-4 animate-fade-in">
                👋 Привет, {user.first_name}!
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Финансовая инфраструктура для роста вашего бизнеса
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Облигации, крипто-карты, аналитика и консалтинг — всё в одном месте
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Наши услуги
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Связаться
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наши решения
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Комплексный подход к финансовой инфраструктуре вашего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Готовы начать?
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Свяжитесь с нами для бесплатной консультации по вашему проекту
              </p>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Связаться с нами
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
