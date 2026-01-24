import { Router, Response } from 'express'
import { Project } from '../models/Project'
import { Article } from '../models/Article'
import { Contact } from '../models/Contact'
import { User } from '../models/User'
import { adminAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get dashboard stats (admin only)
router.get('/dashboard', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [
      projectsCount,
      articlesCount,
      newContactsCount,
      usersCount,
      recentContacts,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Article.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments(),
      Contact.find({ status: 'new' }).sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5),
    ])

    res.json({
      stats: {
        projects: projectsCount,
        articles: articlesCount,
        contacts: newContactsCount,
        users: usersCount,
      },
      recentContacts,
      recentProjects,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
