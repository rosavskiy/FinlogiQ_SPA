import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import projectRoutes from './routes/projects'
import articleRoutes from './routes/articles'
import contactRoutes from './routes/contact'
import statsRoutes from './routes/stats'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(limiter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/stats', statsRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database connection and server start
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finlogiq'
    
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    // Start server anyway for development without DB
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (without database)`)
    })
  }
}

startServer()

export default app
