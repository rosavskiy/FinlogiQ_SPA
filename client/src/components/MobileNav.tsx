import { Link, useLocation } from 'react-router-dom'
import { Home, Briefcase, Lightbulb, Newspaper, User } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/services', icon: Briefcase, label: 'Услуги' },
  { path: '/projects', icon: Lightbulb, label: 'Проекты' },
  { path: '/interesting', icon: Newspaper, label: 'Интересное' },
  { path: '/profile', icon: User, label: 'Профиль' },
]

export default function MobileNav() {
  const location = useLocation()
  const { isTelegram, hapticFeedback } = useTelegram()
  const { isAuthenticated } = useAuthStore()

  const handleNavClick = () => {
    if (isTelegram) {
      hapticFeedback('selection')
    }
  }

  // Show on mobile web and Telegram
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-inset z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isProfileLink = item.path === '/profile'
          
          // If profile and not authenticated, link to login
          const linkPath = isProfileLink && !isAuthenticated ? '/login' : item.path

          return (
            <Link
              key={item.path}
              to={linkPath}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
