import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { contactApi } from '../services/api'
import { useSettings } from '../hooks/useSettings'

export default function Contacts() {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { showBackButton, hideBackButton, isTelegram, webApp, hapticFeedback } = useTelegram()

  useEffect(() => {
    if (isTelegram) {
      showBackButton(() => window.history.back())
      return () => hideBackButton()
    }
  }, [isTelegram, showBackButton, hideBackButton])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await contactApi.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      })

      if (isTelegram) {
        hapticFeedback('notification', 'success')
      }

      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при отправке сообщения')
      if (isTelegram) {
        hapticFeedback('notification', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const openTelegramChat = () => {
    const telegramLink = 'https://t.me/finlogiq_support'
    if (isTelegram && webApp) {
      webApp.openTelegramLink(telegramLink)
    } else {
      window.open(telegramLink, '_blank')
    }
  }

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Контакты
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Как с нами связаться
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-700 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                    <div className="text-primary-600 dark:text-primary-400">{settings.contactEmail}</div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${settings.contactPhone.replace(/[^+\d]/g, '')}`}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-700 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Телефон</div>
                    <div className="text-gray-600 dark:text-gray-400">{settings.contactPhone}</div>
                  </div>
                </a>

                {/* Telegram */}
                <button
                  onClick={openTelegramChat}
                  className="w-full flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-700 hover:shadow-md transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Telegram</div>
                    <div className="text-gray-600 dark:text-gray-400">{settings.telegramBot}</div>
                  </div>
                </button>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Адрес</div>
                    <div className="text-gray-600 dark:text-gray-400">{settings.contactAddress}</div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Часы работы</div>
                    <div className="text-gray-600 dark:text-gray-400">Пн-Пт: 10:00 - 19:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Напишите нам
              </h2>

              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                    Сообщение отправлено!
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    Мы свяжемся с вами в ближайшее время
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Сообщение *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none resize-none"
                      placeholder="Опишите вашу задачу..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        Отправить
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
