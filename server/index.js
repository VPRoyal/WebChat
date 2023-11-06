import createError from 'http-errors';
import express, { json, urlencoded} from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { dirname } from 'path';
import { Scheduler } from '../services/cron.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {config} from "dotenv"
config()

import Router from "../routes/route.js"
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// Global Variables
global.TICKETS=new Map()

var app = express();

// view engine setup
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

// Running cron job
// Scheduler()

app.use('/', Router);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

export default app;
