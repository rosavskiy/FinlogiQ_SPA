import mongoose, { Document, Schema } from 'mongoose'

export interface ISettings extends Document {
  siteName: string
  siteDescription: string
  contactEmail: string
  telegramBot: string
  enableRegistration: boolean
  enableTelegramAuth: boolean
  maintenanceMode: boolean
  showLoadingAnimation: boolean
  showParticlesBackground: boolean
  createdAt: Date
  updatedAt: Date
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: 'FinLogiQ',
    },
    siteDescription: {
      type: String,
      default: 'Финансовые решения для бизнеса',
    },
    contactEmail: {
      type: String,
      default: 'info@finlogiq.ru',
    },
    telegramBot: {
      type: String,
      default: '@finlogiq_bot',
    },
    enableRegistration: {
      type: Boolean,
      default: true,
    },
    enableTelegramAuth: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    showLoadingAnimation: {
      type: Boolean,
      default: true,
    },
    showParticlesBackground: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema)
