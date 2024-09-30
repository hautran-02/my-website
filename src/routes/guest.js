import express from 'express';
import blogController from '~/controllers/blog';
import personalController from '~/controllers/personalController';

const guestRouter = express.Router();

guestRouter.get('/', blogController.viewHome);
guestRouter.get('/blog', blogController.viewBlog);
guestRouter.get('/blog/view/:blogId', blogController.viewBlogContent);

guestRouter.get('/about', personalController.viewabout);

export default guestRouter;
