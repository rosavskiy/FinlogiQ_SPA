import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Проверяем, установлено ли уже приложение (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (navigator as { standalone?: boolean }).standalone === true
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true)
      return
    }

    // Проверяем, не отклонил ли пользователь установку ранее
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      // Показываем снова через 7 дней
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return
      }
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Предотвращаем показ стандартного браузерного баннера
      e.preventDefault()
      // Сохраняем событие для использования позже
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
      localStorage.removeItem('pwa-install-dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false

    try {
      // Показываем нативный диалог установки
      await installPrompt.prompt()
      
      // Ждём выбор пользователя
      const { outcome } = await installPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
      }

      // Очищаем промпт (его можно использовать только один раз)
      setInstallPrompt(null)
      
      return outcome === 'accepted'
    } catch (error) {
      console.error('Error during PWA installation:', error)
      return false
    }
  }, [installPrompt])

  const dismiss = useCallback(() => {
    setIsInstallable(false)
    // Запоминаем время отклонения
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }, [])

  return {
    isInstallable,
    isInstalled,
    install,
    dismiss
  }
}
