import winston, { format } from 'winston';

// Use 'format' instead of 'winston.format'
const { combine, timestamp, printf } = format;


// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger instance with the custom format
const logger = winston.createLogger({
	level: 'info',
	format: combine(
		timestamp(), // Add a timestamp to the log entry
		logFormat,
	),
	transports: [
		new winston.transports.Console(), // Log to console
		new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
		new winston.transports.File({ filename: 'combined.log' }), // Log everything to another file
	],
});

export default logger;