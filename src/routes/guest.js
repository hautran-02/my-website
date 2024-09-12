import express from 'express';
import guestController from '../controllers/guest.js';

const guestRouter = express.Router();

guestRouter.get('/', guestController.viewHome);

export default guestRouter;
