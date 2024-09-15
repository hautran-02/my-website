import express from 'express';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import guestRouter from '~/routes/guest';
import adminRouter from '~/routes/admin';
const app = express();
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DEFAULT_CLUSTER}.iizgaaw.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      eq: (a, b) => a === b,
      formatDate: (date, format = 'MM/DD/YYYY') => {
        if (!format) format = 'MM/DD/YYYY';
        return dayjs(date).format(format);
      },
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(guestRouter);
app.use('/admin', adminRouter);

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
