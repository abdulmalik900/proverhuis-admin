import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  metadesc: {
    type: String,
    trim: true,
    default: ''
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  img: {
    type: String, // Cloudinary URL
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  view_count: {
    type: Number,
    default: 0,
    min: 0
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to populate author details
BlogPostSchema.virtual('author', {
  ref: 'Author',
  localField: 'author_id',
  foreignField: '_id',
  justOne: true
});

// Generate slug from title before saving
BlogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .trim();
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Indexes for better query performance
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ author_id: 1 });
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ view_count: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);