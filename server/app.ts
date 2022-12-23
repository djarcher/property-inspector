// var createError = require('http-errors');
import createError from 'http-errors';
import express from 'express';
import { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'

import logger from 'morgan';


import researchRouter from './routes/research';


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/research', researchRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
app.use(errorHandler);

export default app;
