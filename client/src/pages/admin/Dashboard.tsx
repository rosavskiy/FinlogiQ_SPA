import { FolderKanban, FileText, MessageSquare, Users, TrendingUp, Eye } from 'lucide-react'

const stats = [
  { label: 'Проекты', value: '12', icon: FolderKanban, color: 'bg-blue-500' },
  { label: 'Статьи', value: '24', icon: FileText, color: 'bg-green-500' },
  { label: 'Заявки', value: '8', icon: MessageSquare, color: 'bg-orange-500' },
  { label: 'Пользователи', value: '156', icon: Users, color: 'bg-purple-500' },
]

const recentContacts = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', message: 'Интересует выпуск облигаций...', date: '2 часа назад', status: 'new' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@company.ru', message: 'Хотим обсудить сотрудничество...', date: '5 часов назад', status: 'new' },
  { id: 3, name: 'Алексей Козлов', email: 'alex@firm.com', message: 'Нужна консультация по...', date: '1 день назад', status: 'read' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Дашборд</h2>
        <p className="text-gray-600">Обзор основных показателей</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
            {recentContacts.map((contact) => (
              <div key={contact.id} className="p-4 hover:bg-gray-50">
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
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{contact.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Статистика за неделю</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Просмотры сайта</p>
                  <p className="font-semibold text-gray-900">2,847</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Новые пользователи</p>
                  <p className="font-semibold text-gray-900">34</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +8%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Заявки</p>
                  <p className="font-semibold text-gray-900">12</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +25%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
