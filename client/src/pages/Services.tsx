import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  ArrowRight,
  CheckCircle,
  Code2
} from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

const services = [
  {
    id: 'software',
    icon: Code2,
    title: 'Разработка ПО',
    subtitle: 'Веб и мобильные решения',
    description: 'Полный цикл разработки программного обеспечения: от идеи до запуска и поддержки',
    features: [
      'Веб-приложения и SPA',
      'Мобильные приложения',
      'Telegram Mini Apps',
      'API и интеграции',
      'Техническая поддержка',
    ],
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'consulting',
    icon: Users,
    title: 'Консалтинг',
    subtitle: 'Бизнес-решения',
    description: 'Консалтинг и экспертиза по широкому спектру задач',
    features: [
      'Аудит IT-инфраструктуры',
      'Оптимизация бизнес-процессов',
      'Техническая экспертиза',
      'Подбор технологий',
      'Стратегическое планирование',
    ],
    color: 'from-orange-500 to-orange-600',
  },
]

export default function Services() {
  const { showBackButton, hideBackButton, isTelegram } = useTelegram()

  useEffect(() => {
    if (isTelegram) {
      showBackButton(() => window.history.back())
      return () => hideBackButton()
    }
  }, [isTelegram, showBackButton, hideBackButton])

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Наши услуги
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Комплексные финансовые решения для развития вашего бизнеса
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Icon & Title */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                              {service.title}
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-medium">
                              {service.subtitle}
                            </p>
                          </div>
                          <Link
                            to="/contacts"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors whitespace-nowrap"
                          >
                            Заказать
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {service.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Не нашли подходящее решение?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Мы готовы разработать индивидуальное предложение под ваши задачи
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Обсудить задачу
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
