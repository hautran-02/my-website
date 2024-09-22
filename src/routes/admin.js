import express from 'express';
import blogController from '~/controllers/blog';
import { checkValidationResults } from '~/validators';
import blogValidator from '~/validators/blogValidator';

const adminRouter = express.Router();

adminRouter.get('/blog', blogController.viewBlogManagement);
adminRouter.post('/blog-delete', blogController.deleteBlog);
adminRouter.get('/blog/form', blogController.viewBlogForm);
adminRouter.get('/blog/editor/:blogId', blogController.viewBlogEditor);
adminRouter.post(
  '/blog/new',
  blogValidator(),
  checkValidationResults,
  blogController.createBlog
);
adminRouter.post(
  '/blog/edit/:blogId',
  blogValidator(true),
  checkValidationResults,
  blogController.editBlog
);
adminRouter.post('/blog/change-active/:blogId', blogController.changeActive);
adminRouter.post('/blog/edit-content/:blogId', blogController.editBlogContent);

export default adminRouter;
