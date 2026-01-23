import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  slug: string
  description: string
  fullDescription?: string
  category: string
  status: 'active' | 'completed' | 'upcoming'
  image?: string
  metrics?: {
    label: string
    value: string
  }[]
  tags?: string[]
  isPublished: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'upcoming'],
      default: 'active',
    },
    image: {
      type: String,
    },
    metrics: [{
      label: String,
      value: String,
    }],
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create slug from title if not provided
projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
  }
  next()
})

export const Project = mongoose.model<IProject>('Project', projectSchema)
