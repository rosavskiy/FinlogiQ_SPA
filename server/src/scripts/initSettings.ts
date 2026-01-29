import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Settings } from '../models/Settings'

dotenv.config()

async function initializeSettings() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finlogiq'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    // Проверяем, существуют ли настройки
    const existingSettings = await Settings.findOne()
    
    if (!existingSettings) {
      // Создаем настройки по умолчанию
      const defaultSettings = await Settings.create({
        siteName: 'FinLogiQ',
        siteDescription: 'Финансовые решения для бизнеса',
        contactEmail: 'info@finlogiq.ru',
        telegramBot: '@finlogiq_bot',
        enableRegistration: true,
        enableTelegramAuth: true,
        maintenanceMode: false,
        showLoadingAnimation: true,
        showParticlesBackground: true,
      })
      
      console.log('✅ Default settings created:', defaultSettings)
    } else {
      console.log('ℹ️  Settings already exist')
    }

    await mongoose.disconnect()
    console.log('✅ Done')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

initializeSettings()
