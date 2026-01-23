import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

const projects = [
  {
    id: 1,
    title: 'Облигационный выпуск для IT-компании',
    description: 'Успешное размещение облигаций на 500 млн ₽ для крупной IT-компании с рейтингом BBB+',
    category: 'Облигации',
    image: '/images/project-1.jpg',
    status: 'Завершён',
    year: '2025',
  },
  {
    id: 2,
    title: 'Криптовалютный процессинг для маркетплейса',
    description: 'Интеграция приёма криптовалютных платежей для крупного онлайн-маркетплейса',
    category: 'Крипто',
    image: '/images/project-2.jpg',
    status: 'Завершён',
    year: '2025',
  },
  {
    id: 3,
    title: 'Финансовый анализ для производственного холдинга',
    description: 'Комплексный анализ и подготовка к выходу на рынок публичного долга',
    category: 'Аналитика',
    image: '/images/project-3.jpg',
    status: 'В процессе',
    year: '2026',
  },
  {
    id: 4,
    title: 'Структурирование сделки M&A',
    description: 'Финансовое сопровождение сделки по слиянию двух финтех-компаний',
    category: 'Консалтинг',
    image: '/images/project-4.jpg',
    status: 'Завершён',
    year: '2025',
  },
]

export default function Projects() {
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
            Наши проекты
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Реализованные кейсы и текущие проекты в области финансового консалтинга
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-600">{project.id}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                      {project.category}
                    </span>
                    <span className={`px-3 py-1 backdrop-blur-sm text-xs font-medium rounded-full ${
                      project.status === 'Завершён' 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-yellow-500/90 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{project.year}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <button className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all">
                    Подробнее
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Хотите стать следующим кейсом?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Расскажите о вашем проекте, и мы подготовим индивидуальное предложение
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Обсудить проект
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
