import { body } from 'express-validator';
import { Blog } from '~/models/blog';

const checkUniqueTitle = async (title) => {};

export default (isEdit) => {
  return [
    body('title')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .custom(async (title) => {
        if (!isEdit) {
          const blog = await Blog.findOne({ title });
          if (blog) {
            return Promise.reject('Title already in use');
          }
        }
      }),
    body('description').isString().optional().trim(),
  ];
};
