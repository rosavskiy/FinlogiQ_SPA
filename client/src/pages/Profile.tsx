import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Settings, LogOut, Shield, Bell, CreditCard, FileText, Home, ExternalLink } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const navigate = useNavigate()
  const { isTelegram, showBackButton, hideBackButton, hapticFeedback } = useTelegram()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isTelegram) {
      showBackButton(() => window.history.back())
      return () => hideBackButton()
    }
  }, [isTelegram, showBackButton, hideBackButton])

  const handleLogout = () => {
    if (isTelegram) {
      hapticFeedback('impact', 'medium')
    }
    logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  const menuItems = [
    {
      icon: User,
      label: 'Личные данные',
      description: 'Имя, контакты, аватар',
      href: '#',
    },
    {
      icon: Shield,
      label: 'Безопасность',
      description: 'Пароль, двухфакторная аутентификация',
      href: '#',
    },
    {
      icon: Bell,
      label: 'Уведомления',
      description: 'Email и push-уведомления',
      href: '#',
    },
    {
      icon: CreditCard,
      label: 'Подписка',
      description: 'Текущий план и платежи',
      href: '#',
    },
    {
      icon: FileText,
      label: 'Мои документы',
      description: 'История загрузок и отчёты',
      href: '#',
    },
    {
      icon: Settings,
      label: 'Настройки',
      description: 'Язык, тема, другое',
      href: '#',
    },
  ]

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center">
              {user.telegramId ? (
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {user.name}
              </h1>
              {user.email && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              )}
              {user.telegramId && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram аккаунт
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Выйти из аккаунта
          </button>

          {/* Link to main site - only on desktop (not in Telegram/PWA where bottom nav exists) */}
          {!isTelegram && (
            <Link
              to="/"
              className="hidden md:flex w-full mt-4 items-center justify-center gap-2 p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Перейти на главную
            </Link>
          )}

          {/* Admin link */}
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-medium"
            >
              <Shield className="w-5 h-5" />
              Админ-панель
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
