import createError from 'http-errors';
import express, { json, urlencoded, static as expressStatic } from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
var app = express();

import mongoose from 'mongoose';
const mongoUrl = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12/task-manager";

async function connectDB() {
  mongoose.connect(mongoUrl, {
  })
    .then(() => console.log('Connection with MongoDB successful'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}
connectDB();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressStatic(join(__dirname, 'public')));

import taskList from "./routes/taskList.js";

app.use("/task/list", taskList);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(express.json());
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
