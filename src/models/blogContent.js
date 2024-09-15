import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    content: {
      type: String,
      default: '',
    },
    // Add timestamps for createdAt and updatedAt fields
  },
  { timestamps: true, collection: 'BlogContent' }
);

export const ContentBlog = mongoose.model('BlogContent', blogSchema);
