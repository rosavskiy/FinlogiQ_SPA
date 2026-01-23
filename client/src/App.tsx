import { Routes, Route } from 'react-router-dom'
import { useTelegram } from './context/TelegramContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Services from './pages/Services'
import Interesting from './pages/Interesting'
import Contacts from './pages/Contacts'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  const { isTelegram } = useTelegram()

  return (
    <div className={isTelegram ? 'twa-mode' : ''}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="services" element={<Services />} />
          <Route path="interesting" element={<Interesting />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
