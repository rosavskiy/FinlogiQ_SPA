import { useState, useEffect, useRef } from 'react'
import { Search, MoreVertical, Shield, User, Loader2, UserCheck, Ban, Trash2, LogIn, ChevronDown } from 'lucide-react'
import { usersApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

interface UserData {
  _id: string
  name: string
  email: string
  role: 'admin' | 'user'
  telegramId?: number
  telegramUsername?: string
  status: 'pending' | 'active' | 'blocked'
  createdAt: string
}

const statusConfig = {
  pending: { label: 'На рассмотрении', class: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Активен', class: 'bg-green-100 text-green-700' },
  blocked: { label: 'Заблокирован', class: 'bg-red-100 text-red-700' },
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'blocked'>('all')
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { startImpersonation, user: currentUser } = useAuthStore()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getAll(1, 100)
      setUsers(response.data.users || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || u.status === filter
    return matchesSearch && matchesFilter
  })

  const pendingCount = users.filter(u => u.status === 'pending').length

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await usersApi.updateRole(userId, newRole)
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
      setOpenMenuId(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка смены роли')
    }
  }

  const handleChangeStatus = async (userId: string, newStatus: 'pending' | 'active' | 'blocked') => {
    try {
      await usersApi.updateStatus(userId, newStatus)
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
      setOpenMenuId(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка смены статуса')
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Удалить пользователя "${userName}"? Это действие необратимо.`)) return
    
    try {
      await usersApi.delete(userId)
      setUsers(users.filter(u => u._id !== userId))
      setOpenMenuId(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  const handleImpersonate = async (userId: string) => {
    try {
      const response = await usersApi.impersonate(userId)
      startImpersonation(response.data.user, response.data.token)
      setOpenMenuId(null)
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка имперсонализации')
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
          <p className="text-gray-600">Управление пользователями системы</p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-yellow-700 font-medium">
              {pendingCount} {pendingCount === 1 ? 'заявка' : pendingCount < 5 ? 'заявки' : 'заявок'} на рассмотрении
            </span>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white cursor-pointer"
          >
            <option value="all">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
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
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            {user.telegramUsername ? (
                              <a 
                                href={`https://t.me/${user.telegramUsername}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                @{user.telegramUsername}
                              </a>
                            ) : (
                              <span>{user.telegramId}</span>
                            )}
                          </div>
                          {user.telegramUsername && (
                            <div className="text-gray-400 text-xs">ID: {user.telegramId}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[user.status]?.class || 'bg-gray-100 text-gray-600'}`}>
                        {statusConfig[user.status]?.label || user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end relative" ref={openMenuId === user._id ? menuRef : null}>
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openMenuId === user._id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            {/* Role change */}
                            <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Роль</div>
                            <button
                              onClick={() => handleChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                              disabled={user._id === currentUser?.id}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Shield className="w-4 h-4 text-purple-500" />
                              {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать админом'}
                            </button>
                            
                            <div className="border-t border-gray-100 my-1" />
                            
                            {/* Status change */}
                            <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Статус</div>
                            {user.status === 'pending' && (
                              <button
                                onClick={() => handleChangeStatus(user._id, 'active')}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                              >
                                <UserCheck className="w-4 h-4" />
                                Подтвердить
                              </button>
                            )}
                            {user.status !== 'blocked' ? (
                              <button
                                onClick={() => handleChangeStatus(user._id, 'blocked')}
                                disabled={user._id === currentUser?.id}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Ban className="w-4 h-4" />
                                Заблокировать
                              </button>
                            ) : (
                              <button
                                onClick={() => handleChangeStatus(user._id, 'active')}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                              >
                                <UserCheck className="w-4 h-4" />
                                Разблокировать
                              </button>
                            )}
                            
                            <div className="border-t border-gray-100 my-1" />
                            
                            {/* Impersonate */}
                            <button
                              onClick={() => handleImpersonate(user._id)}
                              disabled={user._id === currentUser?.id || user.status !== 'active'}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <LogIn className="w-4 h-4 text-blue-500" />
                              Войти как...
                            </button>
                            
                            <div className="border-t border-gray-100 my-1" />
                            
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              disabled={user._id === currentUser?.id}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                              Удалить
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
