import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navLinks = [
  { path: '/projects', label: 'Проекты' },
  { path: '/services', label: 'Услуги' },
  { path: '/interesting', label: 'Интересное' },
  { path: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, isImpersonating, stopImpersonation, originalUser } = useAuthStore()

  // Always white header on all pages
  const headerBg = 'bg-white/95 backdrop-blur-lg border-b border-gray-100'
  const textColor = 'text-gray-900'
  const linkColor = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  const activeLinkColor = 'bg-primary-50 text-primary-700'

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-amber-500 text-white text-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>
              Вы вошли как <strong>{user?.name}</strong> (имперсонализация от {originalUser?.name})
            </span>
            <button
              onClick={stopImpersonation}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Вернуться к своему аккаунту
            </button>
          </div>
        </div>
      )}
      
      <header className={`transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/NEW_LOGO.svg" 
              alt="FinlogiQ" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? activeLinkColor
                    : linkColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name || 'Профиль'}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white bg-primary-600 hover:bg-primary-700"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Always white background */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-down border-t border-gray-100 bg-white rounded-b-xl shadow-lg">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px my-2 bg-gray-100" />
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50"
                >
                  Профиль
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-center text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
    </div>
  )
}
