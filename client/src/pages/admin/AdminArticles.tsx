import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react'

interface Article {
  id: number
  title: string
  category: string
  isPublished: boolean
  views: number
  createdAt: string
}

const mockArticles: Article[] = [
  { id: 1, title: 'Как выпустить облигации: пошаговое руководство', category: 'Облигации', isPublished: true, views: 1250, createdAt: '2026-01-20' },
  { id: 2, title: 'Криптовалюта для бизнеса: возможности и риски', category: 'Крипто', isPublished: true, views: 890, createdAt: '2026-01-15' },
  { id: 3, title: 'ESG-рейтинги: зачем они нужны эмитенту', category: 'Аналитика', isPublished: true, views: 654, createdAt: '2026-01-10' },
  { id: 4, title: 'Тренды рынка ВДО в 2026 году', category: 'Рынки', isPublished: false, views: 0, createdAt: '2026-01-05' },
]

export default function AdminArticles() {
  const [articles] = useState<Article[]>(mockArticles)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Статьи</h2>
          <p className="text-gray-600">Управление публикациями</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Новая статья
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск статей..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
        />
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {article.category}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                    {article.isPublished ? 'Опубликовано' : 'Черновик'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </span>
                  <span>{new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Статьи не найдены
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Новая статья</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                    <option>Облигации</option>
                    <option>Крипто</option>
                    <option>Аналитика</option>
                    <option>Рынки</option>
                    <option>Консалтинг</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Время чтения</label>
                  <input type="text" placeholder="5 мин" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
                <textarea rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Содержимое</label>
                <textarea rows={10} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Поддерживается Markdown..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="publish" className="rounded border-gray-300" />
                <label htmlFor="publish" className="text-sm text-gray-700">Опубликовать сразу</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Отмена
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
