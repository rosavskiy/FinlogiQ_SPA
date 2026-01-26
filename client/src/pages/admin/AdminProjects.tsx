import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { projectsApi } from '../../services/api'

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  status: 'active' | 'completed' | 'upcoming'
  isPublished: boolean
  image?: string
  createdAt: string
}

const statusLabels = {
  active: { label: 'Активный', class: 'bg-green-100 text-green-700' },
  completed: { label: 'Завершён', class: 'bg-gray-100 text-gray-700' },
  upcoming: { label: 'Планируется', class: 'bg-blue-100 text-blue-700' },
}

const categories = ['Разработка ПО', 'Консалтинг']

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Разработка ПО',
    status: 'active' as 'active' | 'completed' | 'upcoming',
    isPublished: true,
    image: '',
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsApi.getAllAdmin()
      setProjects(response.data.projects || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки проектов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        isPublished: project.isPublished,
        image: project.image || '',
      })
      setImagePreview(project.image || '')
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        category: 'Разработка ПО',
        status: 'active',
        isPublished: true,
        image: '',
      })
      setImagePreview('')
    }
    setShowModal(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, image: base64String })
      setImagePreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' })
    setImagePreview('')
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Заполните название и описание')
      return
    }

    try {
      setSaving(true)
      if (editingProject) {
        await projectsApi.update(editingProject._id, formData)
      } else {
        await projectsApi.create(formData)
      }
      setShowModal(false)
      fetchProjects()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот проект?')) return
    
    try {
      await projectsApi.delete(id)
      fetchProjects()
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
          <h2 className="text-2xl font-bold text-gray-900">Проекты</h2>
          <p className="text-gray-600">Управление проектами компании</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Добавить проект
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск проектов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Публикация</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{project.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{project.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusLabels[project.status].class}`}>
                      {statusLabels[project.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {project.isPublished ? 'Опубликован' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(project)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Проекты не найдены
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingProject ? 'Редактировать проект' : 'Новый проект'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  >
                    <option value="active">Активный</option>
                    <option value="completed">Завершён</option>
                    <option value="upcoming">Планируется</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea 
                  rows={8} 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" 
                  placeholder="Поддерживаются переносы строк и форматирование"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-gray-500">
                        <Plus className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Нажмите для загрузки изображения</p>
                        <p className="text-xs text-gray-400 mt-1">Макс. 5 МБ</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isPublished" 
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700">Опубликовать</label>
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
                {saving ? 'Сохранение...' : (editingProject ? 'Сохранить' : 'Создать')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
