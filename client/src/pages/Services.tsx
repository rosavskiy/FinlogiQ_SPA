import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  CreditCard, 
  BarChart3, 
  Users, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

const services = [
  {
    id: 'bonds',
    icon: TrendingUp,
    title: 'Выпуск облигаций',
    subtitle: 'От 100 млн ₽ без залога',
    description: 'Полное сопровождение выпуска биржевых облигаций: от структурирования до размещения',
    features: [
      'Структурирование сделки',
      'Подготовка эмиссионной документации',
      'Работа с рейтинговыми агентствами',
      'Маркетинг и размещение',
      'IR-сопровождение',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'crypto',
    icon: CreditCard,
    title: 'Крипто-карта',
    subtitle: 'USDT/USDC с комплаенсом',
    description: 'Решения для приёма и конвертации криптовалютных платежей для бизнеса',
    features: [
      'Приём USDT/USDC',
      'KYC/KYB верификация',
      'Конвертация в фиат',
      'Отчётность для бухгалтерии',
      'Мониторинг транзакций',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Анализ деятельности',
    subtitle: 'Комплексная диагностика',
    description: 'Глубокий анализ финансового состояния и подготовка к выходу на рынок капитала',
    features: [
      'Финансовая диагностика',
      'Стресс-тестирование',
      'Кредитный профиль',
      'ESG-анализ',
      'Рекомендации по улучшению',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'consulting',
    icon: Users,
    title: 'Консалтинг',
    subtitle: 'Индивидуальные решения',
    description: 'Финансовый консалтинг по широкому спектру задач',
    features: [
      'M&A сопровождение',
      'Реструктуризация долга',
      'Due Diligence',
      'Оценка бизнеса',
      'Финансовое моделирование',
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
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Наши услуги
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Комплексные финансовые решения для развития вашего бизнеса
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow animate-slide-up"
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
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {service.title}
                            </h3>
                            <p className="text-primary-600 font-medium">
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

                        <p className="text-gray-600 mb-6">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {service.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
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
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Не нашли подходящее решение?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
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
