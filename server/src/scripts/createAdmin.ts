import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User'

dotenv.config()

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finlogiq'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      process.exit(0)
    }

    // Create admin user
    const admin = new User({
      name: 'Администратор',
      email: 'admin@finlogiq.ru',
      password: 'admin123456',
      role: 'admin',
      isActive: true,
    })

    await admin.save()
    console.log('Admin user created successfully!')
    console.log('Email: admin@finlogiq.ru')
    console.log('Password: admin123456')
    console.log('\n⚠️  Please change the password after first login!')

    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
