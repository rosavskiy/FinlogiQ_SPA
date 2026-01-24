import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, isImpersonating, stopImpersonation, originalUser } = useAuthStore()
  
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // On homepage: transparent header until scrolled, then white
  // On other pages: always white
  const headerBg = isHomePage && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-lg border-b border-gray-100'
  
  const textColor = isHomePage && !isScrolled
    ? 'text-white'
    : 'text-gray-900'
  
  const linkColor = isHomePage && !isScrolled
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  
  const activeLinkColor = isHomePage && !isScrolled
    ? 'bg-white/20 text-white'
    : 'bg-primary-50 text-primary-700'

  return (
    <>
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
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHomePage && !isScrolled ? 'bg-white/20' : 'bg-gradient-to-br from-primary-600 to-primary-800'}`}>
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className={`font-bold text-xl ${textColor}`}>FinlogiQ</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isHomePage && !isScrolled 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name || 'Профиль'}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isHomePage && !isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isHomePage && !isScrolled 
                      ? 'bg-white text-primary-700 hover:bg-primary-50' 
                      : 'text-white bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isHomePage && !isScrolled ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 animate-slide-down ${isHomePage && !isScrolled ? 'border-t border-white/20' : 'border-t border-gray-100 bg-white'}`}>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? activeLinkColor
                      : isHomePage && !isScrolled ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className={`h-px my-2 ${isHomePage && !isScrolled ? 'bg-white/20' : 'bg-gray-100'}`} />
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isHomePage && !isScrolled ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Профиль
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isHomePage && !isScrolled ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium text-center ${
                      isHomePage && !isScrolled ? 'bg-white text-primary-700' : 'text-white bg-primary-600'
                    }`}
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
    </>
  )
}
