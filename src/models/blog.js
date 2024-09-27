import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      required: false,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    blogContents: {
      quill: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BlogContent',
      },
      markdown: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BlogContent',
      },
    },
    active: {
      type: Boolean,
      default: false, // Allow null values for publicTime
    },
    // Add timestamps for createdAt and updatedAt fields
  },
  { timestamps: true, collection: 'Blog' }
);
export const Blog = mongoose.model('Blog', blogSchema);
