import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  img: {
    type: String, // Cloudinary URL
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to get posts count
AuthorSchema.virtual('postsCount', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'author_id',
  count: true
});

// Index for better query performance
AuthorSchema.index({ name: 1 });

export default mongoose.models.Author || mongoose.model('Author', AuthorSchema);