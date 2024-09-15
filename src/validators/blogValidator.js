import { body } from 'express-validator';
import { Blog } from '~/models/blog';

const checkUniqueTitle = async (title) => {
  const blog = await Blog.findOne({ title });
  if (blog) {
    return Promise.reject('Title already in use');
  }
};

export default [
  body('title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .custom(checkUniqueTitle),
  body('description').isString().optional().trim(),
  body('imageUrl').isURL().optional().trim(),
];
