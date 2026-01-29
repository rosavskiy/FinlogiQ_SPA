import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  telegramBot: string
  enableRegistration: boolean
  enableTelegramAuth: boolean
  maintenanceMode: boolean
  showLoadingAnimation: boolean
  showParticlesBackground: boolean
}

const defaultSettings: Settings = {
  siteName: 'FinLogiQ',
  siteDescription: 'Финансовые решения для бизнеса',
  contactEmail: 'info@finlogiq.ru',
  telegramBot: '@finlogiq_bot',
  enableRegistration: true,
  enableTelegramAuth: true,
  maintenanceMode: false,
  showLoadingAnimation: true,
  showParticlesBackground: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err)
      setError('Не удалось загрузить настройки')
      // Используем значения по умолчанию при ошибке
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()

    // Слушаем событие обновления настроек
    const handleSettingsUpdate = () => {
      fetchSettings()
    }
    window.addEventListener('settingsUpdated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate)
    }
  }, [])

  return { settings, loading, error, refetch: fetchSettings }
}
