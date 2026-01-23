import mongoose, { Document, Schema } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

export const Contact = mongoose.model<IContact>('Contact', contactSchema)
