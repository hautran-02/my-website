import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    blogContentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'BlogContent',
    },
    imageUrls: {
      type: Schema.Types.Array,
      default: [],
    },
  },
  { timestamps: true, collection: 'BlogEditorSession' }
);
export const BlogEditorSession = mongoose.model('BlogEditorSession', schema);
