import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, MoreVertical } from 'lucide-react'

interface Project {
  id: number
  title: string
  category: string
  status: 'active' | 'completed' | 'upcoming'
  isPublished: boolean
  createdAt: string
}

const mockProjects: Project[] = [
  { id: 1, title: 'Выпуск облигаций ООО "Технопром"', category: 'Облигации', status: 'active', isPublished: true, createdAt: '2026-01-15' },
  { id: 2, title: 'Криптокарта для ИП Иванов', category: 'Крипто', status: 'completed', isPublished: true, createdAt: '2026-01-10' },
  { id: 3, title: 'Финансовая модель "СтройГрупп"', category: 'Аналитика', status: 'active', isPublished: true, createdAt: '2026-01-08' },
  { id: 4, title: 'Due Diligence "АгроХолдинг"', category: 'Консалтинг', status: 'upcoming', isPublished: false, createdAt: '2026-01-05' },
]

const statusLabels = {
  active: { label: 'Активный', class: 'bg-green-100 text-green-700' },
  completed: { label: 'Завершён', class: 'bg-gray-100 text-gray-700' },
  upcoming: { label: 'Планируется', class: 'bg-blue-100 text-blue-700' },
}

export default function AdminProjects() {
  const [projects] = useState<Project[]>(mockProjects)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Проекты</h2>
          <p className="text-gray-600">Управление проектами компании</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
                <tr key={project.id} className="hover:bg-gray-50">
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
                      <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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

      {/* Modal placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Новый проект</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <option>Облигации</option>
                  <option>Крипто</option>
                  <option>Аналитика</option>
                  <option>Консалтинг</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
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
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
