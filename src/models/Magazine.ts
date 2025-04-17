import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issueNumber: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  pdfFile: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  featuredArticles: [{
    title: String,
    pageNumber: Number,
    description: String,
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Magazine || mongoose.model('Magazine', magazineSchema); 