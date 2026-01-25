import { Router, Request, Response } from 'express'
import { User } from '../models/User'
import { generateToken, AuthRequest, auth } from '../middleware/auth'
import { validateTelegramWebAppData, validateTelegramLoginWidget, sendTelegramNotification } from '../utils/telegram'

const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Все поля обязательны' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' })
    }

    // New users start with pending status - needs admin approval
    const user = new User({ email, password, name, status: 'pending' })
    await user.save()

    // Send Telegram notification to admin
    const notificationMessage = `👤 <b>Новый пользователь!</b>\n\n` +
      `📝 <b>Имя:</b> ${name}\n` +
      `📧 <b>Email:</b> ${email}\n` +
      `📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}\n\n` +
      `⏳ Статус: Ожидает подтверждения`
    
    sendTelegramNotification(notificationMessage).catch(err => {
      console.error('Failed to send Telegram notification:', err)
    })

    const token = generateToken(user._id.toString())

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        notifications: user.notifications,
      },
      token,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' })
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован' })
    }

    // Check if user is pending
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Ваш аккаунт ожидает подтверждения администратором' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' })
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        notifications: user.notifications,
      },
      token,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Telegram Web App Auth
router.post('/telegram', async (req: Request, res: Response) => {
  try {
    const { initData } = req.body

    if (!initData) {
      return res.status(400).json({ message: 'initData обязательна' })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return res.status(500).json({ message: 'Telegram бот не настроен' })
    }

    const telegramData = validateTelegramWebAppData(initData, botToken)
    if (!telegramData || !telegramData.user) {
      return res.status(401).json({ message: 'Недействительные данные Telegram' })
    }

    const { user: tgUser } = telegramData

    // Find or create user
    let user = await User.findOne({ telegramId: tgUser.id })
    let isNewUser = false
    
    if (!user) {
      isNewUser = true
      // New Telegram users start with pending status
      user = new User({
        telegramId: tgUser.id,
        telegramUsername: tgUser.username,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
        avatar: tgUser.photo_url || undefined,
        status: 'pending',
      })
      await user.save()
      
      // Send Telegram notification to admin about new user
      const notificationMessage = `👤 <b>Новый пользователь (Telegram)!</b>\n\n` +
        `📝 <b>Имя:</b> ${user.name}\n` +
        `🆔 <b>Telegram ID:</b> ${tgUser.id}\n` +
        (tgUser.username ? `📱 <b>Username:</b> @${tgUser.username}\n` : '') +
        `📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}\n\n` +
        `⏳ Статус: Ожидает подтверждения`
      
      sendTelegramNotification(notificationMessage).catch(err => {
        console.error('Failed to send Telegram notification:', err)
      })
    } else {
      // Update avatar and username if changed in Telegram
      let needsSave = false
      if (tgUser.photo_url && user.avatar !== tgUser.photo_url) {
        user.avatar = tgUser.photo_url
        needsSave = true
      }
      if (tgUser.username && user.telegramUsername !== tgUser.username) {
        user.telegramUsername = tgUser.username
        needsSave = true
      }
      if (needsSave) {
        await user.save()
      }
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован' })
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
        avatar: user.avatar,
        status: user.status,
        notifications: user.notifications,
      },
      token,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Telegram Login Widget Auth
router.post('/telegram-widget', async (req: Request, res: Response) => {
  try {
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.body

    if (!id || !hash) {
      return res.status(400).json({ message: 'Недостаточно данных от Telegram' })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return res.status(500).json({ message: 'Telegram бот не настроен' })
    }

    const telegramData: Record<string, string> = {
      id: String(id),
      first_name,
      auth_date: String(auth_date),
      hash,
    }

    if (last_name) telegramData.last_name = last_name
    if (username) telegramData.username = username
    if (photo_url) telegramData.photo_url = photo_url

    const isValid = validateTelegramLoginWidget(telegramData, botToken)
    if (!isValid) {
      return res.status(401).json({ message: 'Недействительные данные Telegram' })
    }

    // Find or create user
    let user = await User.findOne({ telegramId: id })
    let isNewUser = false
    
    if (!user) {
      isNewUser = true
      // New Telegram users start with pending status
      user = new User({
        telegramId: id,
        telegramUsername: username,
        name: `${first_name} ${last_name || ''}`.trim(),
        avatar: photo_url || undefined,
        status: 'pending',
      })
      await user.save()
      
      // Send Telegram notification to admin about new user
      const notificationMessage = `👤 <b>Новый пользователь (Telegram Widget)!</b>\n\n` +
        `📝 <b>Имя:</b> ${user.name}\n` +
        `🆔 <b>Telegram ID:</b> ${id}\n` +
        (username ? `📱 <b>Username:</b> @${username}\n` : '') +
        `📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}\n\n` +
        `⏳ Статус: Ожидает подтверждения`
      
      sendTelegramNotification(notificationMessage).catch(err => {
        console.error('Failed to send Telegram notification:', err)
      })
    } else {
      // Update avatar and username if changed in Telegram
      let needsSave = false
      if (photo_url && user.avatar !== photo_url) {
        user.avatar = photo_url
        needsSave = true
      }
      if (username && user.telegramUsername !== username) {
        user.telegramUsername = username
        needsSave = true
      }
      if (needsSave) {
        await user.save()
      }
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован' })
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
        telegramUsername: user.telegramUsername,
        avatar: user.avatar,
        status: user.status,
        notifications: user.notifications,
      },
      token,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      user: {
        id: req.user!._id,
        email: req.user!.email,
        name: req.user!.name,
        role: req.user!.role,
        telegramId: req.user!.telegramId,
        avatar: req.user!.avatar,
        status: req.user!.status,
        notifications: req.user!.notifications,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Logout (just for token invalidation tracking if needed)
router.post('/logout', auth, async (req: AuthRequest, res: Response) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Успешный выход' })
})

export default router
