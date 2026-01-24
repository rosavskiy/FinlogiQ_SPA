import { Router, Response } from 'express'
import { User } from '../models/User'
import { auth, adminAuth, AuthRequest, generateToken } from '../middleware/auth'

const router = Router()

// Get all users (admin only)
router.get('/', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get user by ID
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // Only allow users to see their own profile or admins to see any
    if (req.user!.role !== 'admin' && req.user!._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }

    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update user
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body

    // Only allow users to update their own profile or admins to update any
    if (req.user!.role !== 'admin' && req.user!._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (name) user.name = name
    if (email) user.email = email

    await user.save()

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Change password
router.put('/:id/password', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Only allow users to change their own password
    if (req.user!._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }

    const user = await User.findById(req.params.id).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // Verify current password if user has one
    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный текущий пароль' })
      }
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Пароль успешно изменён' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update avatar
router.put('/:id/avatar', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { avatar } = req.body

    // Only allow users to update their own avatar
    if (req.user!._id.toString() !== req.params.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    user.avatar = avatar
    await user.save()

    res.json({ 
      message: 'Аватар обновлён',
      avatar: user.avatar
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update notification settings
router.put('/:id/notifications', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { email, push, marketing } = req.body

    // Only allow users to update their own settings
    if (req.user!._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    user.notifications = {
      email: email !== undefined ? email : user.notifications.email,
      push: push !== undefined ? push : user.notifications.push,
      marketing: marketing !== undefined ? marketing : user.notifications.marketing,
    }
    await user.save()

    res.json({ 
      message: 'Настройки уведомлений обновлены',
      notifications: user.notifications
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    res.json({ message: 'Пользователь удалён' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update user role (admin only)
router.put('/:id/role', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Недопустимая роль' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    user.role = role
    await user.save()

    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update user active status (admin only)
router.put('/:id/status', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    if (!['pending', 'active', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    user.status = status
    await user.save()

    res.json({ user })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Impersonate user (admin only)
router.post('/:id/impersonate', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    // Generate token for target user
    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
        status: user.status,
      },
      token,
      impersonatedBy: req.user!._id,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
