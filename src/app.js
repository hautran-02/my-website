import express from 'express';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import path from 'path';
import { engine } from 'express-handlebars';
import guestRouter from '~/routes/guest';
import adminRouter from '~/routes/admin';
import multer from 'multer';
const app = express();
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DEFAULT_CLUSTER}.iizgaaw.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

//Upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

app.use(express.json({ limit: '50mb' })); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    componentsDir: path.join(__dirname, 'views', 'components'),
    helpers: {
      eq: (a, b) => a === b,
      formatDate: (date, format = 'MM/DD/YYYY') => {
        if (!format) format = 'MM/DD/YYYY';
        return dayjs(date).format(format);
      },
      math: (lvalue, operator, rvalue) => {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          '+': lvalue + rvalue,
          '-': lvalue - rvalue,
          '*': lvalue * rvalue,
          '/': lvalue / rvalue,
          '%': lvalue % rvalue,
        }[operator];
      },
      jsonStringtify: (obj) => JSON.stringify(obj),
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
