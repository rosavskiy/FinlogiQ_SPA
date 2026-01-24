import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, Loader2 } from 'lucide-react'
import { articlesApi } from '../../services/api'

interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  readTime: string
  isPublished: boolean
  createdAt: string
}

const categories = ['Облигации', 'Крипто', 'Аналитика', 'Рынки', 'Консалтинг']

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Облигации',
    readTime: '5 мин',
    isPublished: false,
  })
  const [saving, setSaving] = useState(false)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await articlesApi.getAllAdmin()
      setArticles(response.data.articles || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки статей')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        readTime: article.readTime,
        isPublished: article.isPublished,
      })
    } else {
      setEditingArticle(null)
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Облигации',
        readTime: '5 мин',
        isPublished: false,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      alert('Заполните заголовок, описание и содержимое')
      return
    }

    try {
      setSaving(true)
      if (editingArticle) {
        await articlesApi.update(editingArticle._id, formData)
      } else {
        await articlesApi.create(formData)
      }
      setShowModal(false)
      fetchArticles()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту статью?')) return
    
    try {
      await articlesApi.delete(id)
      fetchArticles()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Статьи</h2>
          <p className="text-gray-600">Управление публикациями</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
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
          <div key={article._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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
                  <span>{article.readTime}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button 
                  onClick={() => handleOpenModal(article)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(article._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingArticle ? 'Редактировать статью' : 'Новая статья'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Время чтения</label>
                  <input 
                    type="text" 
                    placeholder="5 мин" 
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
                <textarea 
                  rows={2} 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Содержимое</label>
                <textarea 
                  rows={10} 
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" 
                  placeholder="Поддерживается Markdown..." 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="publish" 
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-gray-300" 
                />
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
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
