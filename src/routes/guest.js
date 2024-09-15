import express from 'express';
import blogController from '~/controllers/blog';

const guestRouter = express.Router();

guestRouter.get('/', blogController.viewHome);
guestRouter.get('/blog', blogController.viewBlog);

export default guestRouter;
