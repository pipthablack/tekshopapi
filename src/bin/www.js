import app from '../app.js';
import http from 'http';
const server = http.createServer(app);
import mongoose from 'mongoose';
import config from '../config/connect.js'
import logger from '../utils/logger.js'
import debug from 'debug';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.dbUrl;



const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
  
  var PORT = normalizePort(process.env.PORT || '8081');
  
  server.on('error', onError);
  server.on('listening', onListening);
  
  /**
   * Normalize a port into a number, string, or false.
   */
  function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
  server.listen(PORT, () => {
    logger.info(`Listening to port ${PORT}`);
  });
  
  // Connect to MongoDB before starting the server
  const startApp = async () => {
    try {
      await config.connectDB();
      console.log('\x1b[33m%s\x1b[0m', 'DB: MongoDB Connected'); 
      // No need to start the server here
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', ` ${error.message}`);
      process.exit(1);
    }
  };
  
  // Call the function to start the application
  startApp();
  
  export default server;