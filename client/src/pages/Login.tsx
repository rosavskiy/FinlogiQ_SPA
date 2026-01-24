import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { isTelegram, user: tgUser, webApp, hapticFeedback } = useTelegram()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })
      const { user, token } = response.data

      login(user, token)

      if (isTelegram) {
        hapticFeedback('notification', 'success')
      }

      // Redirect to admin if user is admin
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный email или пароль')
      if (isTelegram) {
        hapticFeedback('notification', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramAuth = async () => {
    if (!isTelegram || !webApp) return

    setIsLoading(true)

    try {
      const response = await authApi.telegramAuth(webApp.initData)
      const { user, token } = response.data

      login(user, token)

      hapticFeedback('notification', 'success')
      
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации через Telegram')
      hapticFeedback('notification', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Вход в аккаунт
          </h1>
          <p className="text-gray-600">
            Войдите, чтобы получить доступ к личному кабинету
          </p>
        </div>

        {/* Telegram Auth Button (if in Telegram) */}
        {isTelegram && tgUser && (
          <button
            onClick={handleTelegramAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-[#54a9eb] text-white font-medium rounded-xl hover:bg-[#4a9ad9] disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Войти как {tgUser.first_name}
          </button>
        )}

        {isTelegram && tgUser && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">или</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-600">Запомнить меня</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Забыли пароль?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Войти
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
