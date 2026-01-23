import { Router, Request, Response } from 'express'
import { User } from '../models/User'
import { generateToken, AuthRequest, auth } from '../middleware/auth'
import { validateTelegramWebAppData } from '../utils/telegram'

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

    const user = new User({ email, password, name })
    await user.save()

    const token = generateToken(user._id.toString())

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    
    if (!user) {
      user = new User({
        telegramId: tgUser.id,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
      })
      await user.save()
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
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
