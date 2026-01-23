import mongoose, { Document, Schema } from 'mongoose'

export interface IArticle extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author?: mongoose.Types.ObjectId
  image?: string
  readTime: string
  tags?: string[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const articleSchema = new Schema<IArticle>(
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
    },
    readTime: {
      type: String,
      default: '5 мин',
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create slug from title if not provided
articleSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Set publishedAt when publishing
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

export const Article = mongoose.model<IArticle>('Article', articleSchema)
