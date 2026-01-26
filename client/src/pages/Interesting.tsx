import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { articlesApi } from '../services/api'

interface Article {
  _id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  createdAt: string
  slug: string
}

export default function Interesting() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>(['Все'])
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [loading, setLoading] = useState(true)
  const { showBackButton, hideBackButton, isTelegram, hapticFeedback } = useTelegram()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          articlesApi.getAll(1, 50),
          articlesApi.getCategories()
        ])
        setArticles(articlesRes.data.articles || [])
        setCategories(['Все', ...(categoriesRes.data.categories || [])])
      } catch (err) {
        console.error('Error loading articles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Интересное
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Статьи, аналитика и новости из мира финансов
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-0 md:top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <article
                  key={article._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image placeholder */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary-50 to-primary-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600">{index + 1}</span>
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.createdAt)}
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
          )}

          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">В этой категории пока нет статей</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
