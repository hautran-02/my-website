import express from 'express';
import blogController from '~/controllers/blog';
import { checkValidationResults } from '~/validators';
import blogValidator from '~/validators/blogValidator';

const adminRouter = express.Router();

adminRouter.get('/blog/create', blogController.viewBlogForm);
adminRouter.post(
  '/blog/new',
  blogValidator,
  checkValidationResults,
  blogController.createBlog
);

export default adminRouter;
