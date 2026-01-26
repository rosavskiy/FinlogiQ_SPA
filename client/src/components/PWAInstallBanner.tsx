import { useState, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { useTelegram } from '../context/TelegramContext'

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, install, dismiss } = usePWAInstall()
  const { isTelegram } = useTelegram()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Показываем баннер с небольшой задержкой для плавности
    if (isInstallable && !isTelegram) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isTelegram])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      dismiss()
    }, 300)
  }

  // Не показываем в Telegram, если уже установлено или нельзя установить
  if (!isVisible || isInstalled || isTelegram) {
    return null
  }

  return (
    <>
      {/* Overlay для затемнения */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Баннер */}
      <div 
        className={`fixed bottom-24 left-4 right-4 z-50 transition-all duration-300 ${
          isClosing 
            ? 'opacity-0 translate-y-4' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl shadow-blue-500/25 overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-5">
            {/* Кнопка закрытия */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-4">
              {/* Иконка приложения */}
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <img 
                  src="/icons/icon-192x192.svg" 
                  alt="FinlogiQ" 
                  className="w-12 h-12"
                />
              </div>

              {/* Текст */}
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-white font-semibold text-lg leading-tight">
                  Установите приложение
                </h3>
                <p className="text-blue-100 text-sm mt-1 leading-snug">
                  Добавьте FinlogiQ на главный экран для быстрого доступа
                </p>
              </div>
            </div>

            {/* Преимущества */}
            <div className="flex items-center gap-4 mt-4 text-xs text-blue-100">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Быстрый запуск</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Работает офлайн</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Уведомления</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                Не сейчас
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-lg"
              >
                Установить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
