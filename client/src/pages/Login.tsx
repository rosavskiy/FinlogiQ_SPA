import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTelegram } from '../context/TelegramContext'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/api'

// Declare global Telegram Login Widget callback
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

function TelegramLoginWidget({ botUsername, onAuth }: { botUsername: string; onAuth: (user: any) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Set global callback
    window.onTelegramAuth = onAuth

    // Create script element
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '10')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    ref.current.appendChild(script)

    return () => {
      if (ref.current) {
        ref.current.innerHTML = ''
      }
      delete window.onTelegramAuth
    }
  }, [botUsername, onAuth])

  return <div ref={ref} className="flex justify-center" />
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { isTelegram, user: tgUser, webApp, hapticFeedback } = useTelegram()
  const { login } = useAuthStore()

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

  const handleTelegramWidgetAuth = async (user: any) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await authApi.telegramWidgetAuth(user)
      const { user: userData, token } = response.data

      login(userData, token)
      
      if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации через Telegram')
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
            Войдите через Telegram для доступа к личному кабинету
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
              {error}
            </div>
          )}

          {isTelegram && tgUser ? (
            <button
              onClick={handleTelegramAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#54a9eb] text-white font-medium rounded-xl hover:bg-[#4a9ad9] disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Войти как {tgUser.first_name}
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Вход через Telegram
              </h3>
              <p className="text-gray-600 mb-4">
                Нажмите на кнопку ниже для авторизации
              </p>
              {error && error.includes('Bot domain invalid') && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                  <p className="font-medium mb-1">⚠️ Требуется настройка домена</p>
                  <p className="text-xs">
                    Откройте @BotFather → /mybots → выберите бота → Bot Settings → Domain → добавьте {window.location.hostname}
                  </p>
                </div>
              )}
              <TelegramLoginWidget 
                botUsername={import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'finlogiq_bot'}
                onAuth={handleTelegramWidgetAuth}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
