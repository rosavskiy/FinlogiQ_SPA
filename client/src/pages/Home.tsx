import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Users } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import ParticlesBackground from '../components/ParticlesBackground'

const features = [
  {
    icon: Code2,
    title: 'Разработка ПО',
    description: 'Веб-приложения, мобильные решения и Telegram Mini Apps',
    color: 'bg-indigo-500',
  },
  {
    icon: Users,
    title: 'Консалтинг',
    description: 'IT-экспертиза и оптимизация бизнес-процессов',
    color: 'bg-orange-500',
  },
]

export default function Home() {
  const { isTelegram, user } = useTelegram()
  const [showParticles, setShowParticles] = useState(true)

  useEffect(() => {
    const setting = localStorage.getItem('showParticlesBackground')
    if (setting !== null) {
      setShowParticles(setting === 'true')
    }
  }, [])

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section - full screen with header overlay */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white min-h-[100vh] -mt-16 flex flex-col justify-center">
        {showParticles && <ParticlesBackground />}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
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
              Разработка программного обеспечения и IT-консалтинг
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
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Наши решения
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Комплексный подход к финансовой инфраструктуре вашего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-800 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
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
