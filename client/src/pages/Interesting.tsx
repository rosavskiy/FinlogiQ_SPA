import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image?: string
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Как выпустить облигации: пошаговое руководство',
    excerpt: 'Подробный гайд по выпуску биржевых облигаций для среднего бизнеса: от подготовки до размещения',
    category: 'Облигации',
    readTime: '10 мин',
    date: '20 января 2026',
  },
  {
    id: 2,
    title: 'Криптовалюта для бизнеса: возможности и риски',
    excerpt: 'Обзор способов интеграции криптовалютных платежей в бизнес-процессы компании',
    category: 'Крипто',
    readTime: '7 мин',
    date: '15 января 2026',
  },
  {
    id: 3,
    title: 'ESG-рейтинги: зачем они нужны эмитенту',
    excerpt: 'Как ESG-факторы влияют на стоимость привлечения капитала и интерес инвесторов',
    category: 'Аналитика',
    readTime: '5 мин',
    date: '10 января 2026',
  },
  {
    id: 4,
    title: 'Тренды рынка ВДО в 2026 году',
    excerpt: 'Прогнозы и ожидания от рынка высокодоходных облигаций в текущем году',
    category: 'Рынки',
    readTime: '8 мин',
    date: '5 января 2026',
  },
  {
    id: 5,
    title: 'Финансовое моделирование: лучшие практики',
    excerpt: 'Как построить надёжную финансовую модель для привлечения инвестиций',
    category: 'Аналитика',
    readTime: '12 мин',
    date: '28 декабря 2025',
  },
  {
    id: 6,
    title: 'Due Diligence: на что обращают внимание инвесторы',
    excerpt: 'Чек-лист подготовки компании к проверке со стороны инвесторов и кредиторов',
    category: 'Консалтинг',
    readTime: '6 мин',
    date: '20 декабря 2025',
  },
]

const categories = ['Все', 'Облигации', 'Крипто', 'Аналитика', 'Рынки', 'Консалтинг']

export default function Interesting() {
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const { showBackButton, hideBackButton, isTelegram, hapticFeedback } = useTelegram()

  useEffect(() => {
    if (isTelegram) {
      showBackButton(() => window.history.back())
      return () => hideBackButton()
    }
  }, [isTelegram, showBackButton, hideBackButton])

  const filteredArticles = selectedCategory === 'Все'
    ? articles
    : articles.filter(a => a.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (isTelegram) {
      hapticFeedback('selection')
    }
  }

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Интересное
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Статьи, аналитика и новости из мира финансов
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-0 md:top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-primary-50 to-primary-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">{article.id}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Читать
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">В этой категории пока нет статей</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
