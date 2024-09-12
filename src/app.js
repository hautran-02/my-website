import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import guestRouter from '~/routes/guest';
import { engine } from 'express-handlebars';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DEFAULT_CLUSTER}.iizgaaw.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=NodeComplete1`;

const app = express();
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(guestRouter);

mongoose.connect(uri).then(
  () => {
    console.log('Connect database successfully');
    console.log('Server run on', process.env.PORT);
    app.listen(process.env.PORT);
  },
  (err) => {
    console.log('Connect database failed', err);
  }
);
