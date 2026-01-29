import { Router, Response, Request } from 'express'
import { Settings } from '../models/Settings'
import { adminAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Get global settings (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne()
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        siteName: 'FinLogiQ',
        siteDescription: 'Финансовые решения для бизнеса',
        contactEmail: 'info@finlogiq.ru',
        contactPhone: '+7 (495) 123-45-67',
        contactAddress: 'Москва, Россия',
        telegramBot: '@finlogiq_bot',
        enableRegistration: true,
        enableTelegramAuth: true,
        maintenanceMode: false,
        showLoadingAnimation: true,
        showParticlesBackground: true,
      })
    }

    res.json(settings)
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

// Update settings (admin only)
router.put('/', adminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      contactAddress,
      telegramBot,
      enableRegistration,
      enableTelegramAuth,
      maintenanceMode,
      showLoadingAnimation,
      showParticlesBackground,
    } = req.body

    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = new Settings()
    }

    // Update fields
    if (siteName !== undefined) settings.siteName = siteName
    if (siteDescription !== undefined) settings.siteDescription = siteDescription
    if (contactEmail !== undefined) settings.contactEmail = contactEmail
    if (contactPhone !== undefined) settings.contactPhone = contactPhone
    if (contactAddress !== undefined) settings.contactAddress = contactAddress
    if (telegramBot !== undefined) settings.telegramBot = telegramBot
    if (enableRegistration !== undefined) settings.enableRegistration = enableRegistration
    if (enableTelegramAuth !== undefined) settings.enableTelegramAuth = enableTelegramAuth
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode
    if (showLoadingAnimation !== undefined) settings.showLoadingAnimation = showLoadingAnimation
    if (showParticlesBackground !== undefined) settings.showParticlesBackground = showParticlesBackground

    await settings.save()

    res.json({
      message: 'Настройки успешно обновлены',
      settings,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Ошибка сервера' })
  }
})

export default router
