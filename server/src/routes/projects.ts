import { Router, Request, Response } from 'express'
import { Project } from '../models/Project'
import { auth, adminAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all published projects (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const category = req.query.category as string

    const query: any = { isPublished: true }
    if (category && category !== 'all') {
      query.category = category
    }

    const projects = await Project.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ order: 1, createdAt: -1 })

    const total = await Project.countDocuments(query)

    res.json({
      projects,
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

// Get project by slug (public)
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      isPublished: true,
    })

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' })
    }

    res.json({ project })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Get all projects including unpublished (admin only)
router.get('/admin/all', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const projects = await Project.find()
      .skip(skip)
      .limit(limit)
      .sort({ order: 1, createdAt: -1 })

    const total = await Project.countDocuments()

    res.json({
      projects,
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

// Get project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' })
    }

    res.json({ project })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Create project (admin only)
router.post('/', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const project = new Project(req.body)
    await project.save()

    res.status(201).json({ project })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update project (admin only)
router.put('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' })
    }

    res.json({ project })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Delete project (admin only)
router.delete('/:id', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' })
    }

    res.json({ message: 'Проект удалён' })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
