import { Router, Request, Response } from 'express'
import { Contact } from '../models/Contact'
import { adminAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Submit contact form (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Имя, email и сообщение обязательны' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Некорректный email' })
    }

    const contact = new Contact({ name, email, phone, message })
    await contact.save()

    // Here you could also send email notification to admin
    // await sendEmailNotification(contact)

    res.status(201).json({ message: 'Сообщение успешно отправлено' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get all contact messages (admin only)
router.get('/', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const status = req.query.status as string

    const query: any = {}
    if (status) {
      query.status = status
    }

    const contacts = await Contact.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Contact.countDocuments(query)

    res.json({
      contacts,
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

// Get unread count (admin only)
router.get('/unread', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const count = await Contact.countDocuments({ status: 'new' })
    res.json({ count })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get contact message by ID (admin only)
router.get('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: 'Сообщение не найдено' })
    }

    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read'
      await contact.save()
    }

    res.json({ contact })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update contact status (admin only)
router.put('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Некорректный статус' })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({ message: 'Сообщение не найдено' })
    }

    res.json({ contact })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Delete contact message (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: 'Сообщение не найдено' })
    }

    res.json({ message: 'Сообщение удалено' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
