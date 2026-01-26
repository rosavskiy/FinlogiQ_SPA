import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useTelegram } from '../context/TelegramContext'
import MobileNav from './MobileNav'
import PWAInstallBanner from './PWAInstallBanner'

export default function Layout() {
  const { isTelegram } = useTelegram()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide header in Telegram - use native back button instead */}
      {!isTelegram && <Header />}
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Show mobile bottom nav in Telegram or on mobile web */}
      <MobileNav />
      
      {/* Hide footer in Telegram */}
      {!isTelegram && <Footer />}

      {/* Custom PWA install banner */}
      <PWAInstallBanner />
    </div>
  )
}
