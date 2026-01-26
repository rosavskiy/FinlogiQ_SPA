import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  User, Mail, Settings, LogOut, Shield, Bell, CreditCard, FileText, 
  ExternalLink, ArrowLeft, Save, Check, X,
  Moon, Sun, Globe, Loader2, Camera
} from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { useTheme } from '../context/ThemeContext'
import { useAuthStore } from '../store/authStore'
import { usersApi } from '../services/api'

type Section = 'menu' | 'personal' | 'notifications' | 'subscription' | 'documents' | 'settings'

export default function Profile() {
  const navigate = useNavigate()
  const { isTelegram, showBackButton, hideBackButton, hapticFeedback } = useTelegram()
  const { user, isAuthenticated, logout, setUser } = useAuthStore()
  const [activeSection, setActiveSection] = useState<Section>('menu')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isTelegram) {
      if (activeSection === 'menu') {
        showBackButton(() => window.history.back())
      } else {
        showBackButton(() => setActiveSection('menu'))
      }
      return () => hideBackButton()
    }
  }, [isTelegram, activeSection, showBackButton, hideBackButton])

  const handleLogout = () => {
    if (isTelegram) {
      hapticFeedback('impact', 'medium')
    }
    logout()
    navigate('/')
  }

  const handleBack = () => {
    setActiveSection('menu')
  }

  if (!user) {
    return null
  }

  const menuItems = [
    { id: 'personal' as Section, icon: User, label: 'Личные данные', description: 'Имя, контакты, аватар' },
    { id: 'notifications' as Section, icon: Bell, label: 'Уведомления', description: 'Email и push-уведомления' },
    { id: 'subscription' as Section, icon: CreditCard, label: 'Подписка', description: 'Текущий план и платежи' },
    { id: 'documents' as Section, icon: FileText, label: 'Мои документы', description: 'История загрузок и отчёты' },
    { id: 'settings' as Section, icon: Settings, label: 'Настройки', description: 'Язык, тема, другое' },
  ]

  return (
    <div className="pt-16 pb-20 md:pb-0 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - compact when in subsection */}
      <section className={`bg-gradient-to-br from-primary-600 to-primary-800 ${activeSection === 'menu' ? 'py-12 md:py-16' : 'py-6 md:py-8'} transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeSection !== 'menu' && !isTelegram && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к меню
            </button>
          )}
          
          <div className={`flex ${activeSection === 'menu' ? 'flex-col md:flex-row' : 'flex-row'} items-center gap-4 md:gap-6`}>
            {/* Avatar */}
            <div className={`${activeSection === 'menu' ? 'w-24 h-24 md:w-32 md:h-32' : 'w-16 h-16'} bg-white/20 rounded-full flex items-center justify-center transition-all overflow-hidden`}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={`${activeSection === 'menu' ? 'text-4xl md:text-5xl' : 'text-2xl'} font-bold text-white`}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className={activeSection === 'menu' ? 'text-center md:text-left' : 'text-left'}>
              <h1 className={`${activeSection === 'menu' ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold text-white mb-1`}>
                {user.name}
              </h1>
              {user.email && activeSection === 'menu' && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeSection === 'menu' && (
            <MenuSection 
              menuItems={menuItems} 
              onSelect={setActiveSection}
              onLogout={handleLogout}
              isTelegram={isTelegram}
              isAdmin={user.role === 'admin'}
            />
          )}
          {activeSection === 'personal' && <PersonalSection user={user} setUser={setUser} />}
          {activeSection === 'notifications' && <NotificationsSection user={user} setUser={setUser} />}
          {activeSection === 'subscription' && <SubscriptionSection />}
          {activeSection === 'documents' && <DocumentsSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </section>
    </div>
  )
}

// Menu Section
function MenuSection({ 
  menuItems, 
  onSelect, 
  onLogout, 
  isTelegram,
  isAdmin 
}: { 
  menuItems: { id: Section; icon: any; label: string; description: string }[]
  onSelect: (section: Section) => void
  onLogout: () => void
  isTelegram: boolean
  isAdmin: boolean
}) {
  return (
    <>
      <div className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group text-left"
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
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
      >
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>

      {!isTelegram && (
        <Link
          to="/"
          className="hidden md:flex w-full mt-4 items-center justify-center gap-2 p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
        >
          <ExternalLink className="w-5 h-5" />
          Перейти на главную
        </Link>
      )}

      {isAdmin && (
        <Link
          to="/admin"
          className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-medium"
        >
          <Shield className="w-5 h-5" />
          Админ-панель
        </Link>
      )}
    </>
  )
}

// Personal Data Section
function PersonalSection({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await usersApi.update(user.id, { name, email })
      setUser({ ...user, name, email })
      setMessage({ type: 'success', text: 'Данные успешно обновлены' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка при сохранении' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите изображение' })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Размер файла не должен превышать 2 МБ' })
      return
    }

    setIsUploadingAvatar(true)
    setMessage(null)

    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = reader.result as string
          await usersApi.updateAvatar(user.id, base64)
          setUser({ ...user, avatar: base64 })
          setMessage({ type: 'success', text: 'Аватар обновлён' })
        } catch (err: any) {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка при загрузке аватара' })
        } finally {
          setIsUploadingAvatar(false)
        }
      }
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Ошибка при чтении файла' })
        setIsUploadingAvatar(false)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Ошибка при загрузке аватара' })
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Личные данные</h2>
      
      {/* Avatar upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
            {isUploadingAvatar ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">Нажмите для загрузки фото (макс. 2 МБ)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>

        {user.telegramId ? (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="font-medium">Telegram привязан</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">ID: {user.telegramId}</p>
            {user.telegramUsername && (
              <p className="text-sm text-blue-600">Username: @{user.telegramUsername}</p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="font-medium">Telegram не привязан</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Привяжите Telegram для быстрого входа и получения уведомлений
            </p>
            <a
              href="https://t.me/finlogiq_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Привязать Telegram
            </a>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Сохранить изменения
        </button>
      </form>
    </div>
  )
}

// Notifications Section
function NotificationsSection({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [emailNotifications, setEmailNotifications] = useState(user.notifications?.email ?? true)
  const [pushNotifications, setPushNotifications] = useState(user.notifications?.push ?? false)
  const [marketingEmails, setMarketingEmails] = useState(user.notifications?.marketing ?? false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = async (type: 'email' | 'push' | 'marketing', value: boolean) => {
    // Update local state immediately
    if (type === 'email') setEmailNotifications(value)
    if (type === 'push') setPushNotifications(value)
    if (type === 'marketing') setMarketingEmails(value)

    setIsSaving(true)
    setMessage(null)

    try {
      const data = { [type]: value }
      const response = await usersApi.updateNotifications(user.id, data)
      
      // Update user in store
      setUser({ 
        ...user, 
        notifications: response.data.notifications 
      })
    } catch (err: any) {
      // Revert local state on error
      if (type === 'email') setEmailNotifications(!value)
      if (type === 'push') setPushNotifications(!value)
      if (type === 'marketing') setMarketingEmails(!value)
      setMessage({ type: 'error', text: 'Ошибка при сохранении настроек' })
    } finally {
      setIsSaving(false)
    }
  }

  const Toggle = ({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Уведомления</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Email-уведомления</div>
            <div className="text-sm text-gray-500">Получать уведомления о важных событиях на email</div>
          </div>
          <Toggle enabled={emailNotifications} onChange={(v) => handleToggle('email', v)} disabled={isSaving} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Push-уведомления</div>
            <div className="text-sm text-gray-500">Получать уведомления в браузере</div>
          </div>
          <Toggle enabled={pushNotifications} onChange={(v) => handleToggle('push', v)} disabled={isSaving} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Маркетинговые рассылки</div>
            <div className="text-sm text-gray-500">Получать новости и специальные предложения</div>
          </div>
          <Toggle enabled={marketingEmails} onChange={(v) => handleToggle('marketing', v)} disabled={isSaving} />
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <p className="text-sm text-amber-700">
          <strong>Примечание:</strong> Push-уведомления и маркетинговые рассылки пока находятся в разработке. 
          Настройки сохраняются для будущего использования.
        </p>
      </div>
    </div>
  )
}

// Subscription Section
function SubscriptionSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Подписка</h2>
      
      <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-primary-600 font-medium">Текущий план</div>
            <div className="text-2xl font-bold text-gray-900">Бесплатный</div>
          </div>
          <CreditCard className="w-10 h-10 text-primary-600" />
        </div>
        <p className="text-gray-600 text-sm">
          Базовый доступ к платформе. Обновитесь для получения дополнительных функций.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-900">Профессиональный</div>
            <div className="text-primary-600 font-bold">₽990/мес</div>
          </div>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• Расширенная аналитика</li>
            <li>• Приоритетная поддержка</li>
            <li>• Экспорт отчётов</li>
          </ul>
          <button className="w-full px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
            Выбрать план
          </button>
        </div>

        <div className="p-4 border border-primary-200 bg-primary-50/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-900">Бизнес</div>
            <div className="text-primary-600 font-bold">₽2990/мес</div>
          </div>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• Всё из Профессионального</li>
            <li>• API доступ</li>
            <li>• Персональный менеджер</li>
          </ul>
          <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Выбрать план
          </button>
        </div>
      </div>
    </div>
  )
}

// Documents Section
function DocumentsSection() {
  const documents = [
    { id: 1, name: 'Договор оферты.pdf', date: '15.01.2026', size: '245 KB' },
    { id: 2, name: 'Акт выполненных работ.pdf', date: '10.01.2026', size: '128 KB' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Мои документы</h2>
      
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{doc.name}</div>
                <div className="text-sm text-gray-500">{doc.date} • {doc.size}</div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Скачать
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500">Документов пока нет</div>
        </div>
      )}
    </div>
  )
}

// Settings Section
function SettingsSection() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState('ru')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Настройки</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Тема оформления</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Светлая' },
              { id: 'dark', icon: Moon, label: 'Тёмная' },
              { id: 'system', icon: Settings, label: 'Системная' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id as 'light' | 'dark' | 'system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  theme === option.id 
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <option.icon className={`w-5 h-5 ${theme === option.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`text-sm font-medium ${theme === option.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Язык интерфейса</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none appearance-none bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Опасная зона</h3>
          <button className="px-4 py-2 text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm font-medium">
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  )
}
