import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import createError from 'http-errors';
import httpStatus from 'http-status';
import logger from './utils/logger.js'
import { errorConverter, errorHandler } from './middleware/errorHandler.js';
import { authLimiter } from './middleware/rateLimiter.js'
import ApiError from './utils/ApiError.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'
// Load environment variables from .env file
dotenv.config();


// Instantiate the application
const app = express();

// Port declaration
const PORT = process.env.PORT || 8000;




// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

// enable cors
app.use(cors());
app.options('*', cors());



app.use(authLimiter)


app.use('/api/auth', userRoutes);
app.use('/api/v1', productRoutes);

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
    logger.info('This is an informational log message');
    res.send('Hello World!');
  });
  
  // ERROR HANDLERS
  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });
  


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    console.error(err); // Log the error
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send(err.message); // Send error message as response
  });
  
  




export default app;