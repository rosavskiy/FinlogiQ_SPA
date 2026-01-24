import { useState, useEffect } from 'react'
import { FolderKanban, FileText, MessageSquare, Users, TrendingUp, Eye, Loader2 } from 'lucide-react'
import { statsApi } from '../../services/api'

interface DashboardStats {
  projects: number
  articles: number
  contacts: number
  users: number
}

interface RecentContact {
  _id: string
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await statsApi.getDashboard()
        setStats(response.data.stats)
        setRecentContacts(response.data.recentContacts || [])
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Только что'
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'час' : 'часов'} назад`
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'день' : 'дней'} назад`
    return date.toLocaleDateString('ru-RU')
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

  const statsData = [
    { label: 'Проекты', value: stats?.projects || 0, icon: FolderKanban, color: 'bg-blue-500' },
    { label: 'Статьи', value: stats?.articles || 0, icon: FileText, color: 'bg-green-500' },
    { label: 'Заявки', value: stats?.contacts || 0, icon: MessageSquare, color: 'bg-orange-500' },
    { label: 'Пользователи', value: stats?.users || 0, icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Дашборд</h2>
        <p className="text-gray-600">Обзор основных показателей</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Новые заявки</h3>
            <a href="/admin/contacts" className="text-sm text-primary-600 hover:text-primary-700">
              Все заявки →
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <div key={contact._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        {contact.status === 'new' && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                            Новая
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                      <p className="text-sm text-gray-600 mt-1 truncate">{contact.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {formatRelativeTime(contact.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Нет новых заявок
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Сводка</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего проектов</p>
                  <p className="font-semibold text-gray-900">{stats?.projects || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего пользователей</p>
                  <p className="font-semibold text-gray-900">{stats?.users || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Новых заявок</p>
                  <p className="font-semibold text-gray-900">{stats?.contacts || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
