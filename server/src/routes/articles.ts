import { Router, Request, Response } from 'express'
import { Article } from '../models/Article'
import { auth, adminAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all published articles (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const category = req.query.category as string

    const query: any = { isPublished: true }
    if (category && category !== 'all' && category !== 'Все') {
      query.category = category
    }

    const articles = await Article.find(query)
      .populate('author', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1, createdAt: -1 })

    const total = await Article.countDocuments(query)

    res.json({
      articles,
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

// Get categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await Article.distinct('category', { isPublished: true })
    res.json({ categories })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get article by slug (public)
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate('author', 'name')

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' })
    }

    res.json({ article })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get all articles including drafts (admin only)
router.get('/admin/all', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const articles = await Article.find()
      .populate('author', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Article.countDocuments()

    res.json({
      articles,
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

// Get article by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name')

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' })
    }

    res.json({ article })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Create article (admin only)
router.post('/', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user!._id,
    })
    await article.save()

    res.status(201).json({ article })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update article (admin only)
router.put('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name')

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' })
    }

    res.json({ article })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Delete article (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' })
    }

    res.json({ message: 'Статья удалена' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
