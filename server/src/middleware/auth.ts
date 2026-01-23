import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'

export interface AuthRequest extends Request {
  user?: IUser
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Авторизация требуется' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string }
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Пользователь не найден' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Недействительный токен' })
  }
}

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, () => {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещён' })
      }
      next()
    })
  } catch (error) {
    res.status(403).json({ message: 'Доступ запрещён' })
  }
}

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  )
}
