import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    type: {
      type: String,
      default: 'markdown',
      enum: ['markdown', 'quill'],
    },
    content: {
      type: Schema.Types.Mixed,
      default: '',
    },
    // Add timestamps for createdAt and updatedAt fields
  },
  { timestamps: true, collection: 'BlogContent' }
);

export const BlogContent = mongoose.model('BlogContent', blogSchema);
