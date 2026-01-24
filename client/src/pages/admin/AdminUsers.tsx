import { useState } from 'react'
import { Search, MoreVertical, Shield, User, Ban } from 'lucide-react'

interface UserData {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  telegramId?: number
  isActive: boolean
  createdAt: string
}

const mockUsers: UserData[] = [
  { id: 1, name: 'Администратор', email: 'admin@finlogiq.ru', role: 'admin', isActive: true, createdAt: '2026-01-01' },
  { id: 2, name: 'Иван Петров', email: 'ivan@example.com', role: 'user', telegramId: 123456789, isActive: true, createdAt: '2026-01-15' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@company.ru', role: 'user', isActive: true, createdAt: '2026-01-18' },
  { id: 4, name: 'Алексей Козлов', email: 'alex@firm.com', role: 'user', telegramId: 987654321, isActive: false, createdAt: '2026-01-20' },
]

export default function AdminUsers() {
  const [users] = useState<UserData[]>(mockUsers)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
        <p className="text-gray-600">Управление пользователями системы</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telegram</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Регистрация</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-purple-600" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.telegramId ? (
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Привязан
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
