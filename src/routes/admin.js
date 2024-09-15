import express from 'express';
import blogController from '~/controllers/blog';

const adminRouter = express.Router();

adminRouter.get('/blog/create', blogController.viewBlogForm);
adminRouter.post('/blog/new', blogController.createBlog);

export default adminRouter;
