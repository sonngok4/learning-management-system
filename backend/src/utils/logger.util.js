// utils/logger.util.js
const winston = require('winston');
const config = require('../config/environment');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss',
	}),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.json(),
)

const logger = winston.createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: logFormat,
	defaultMeta: { service: 'backend' },
	transports: [
		// Write all logs to console
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ timestamp, level, message, stack }) => {
					return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`;
				})
			),
		}),
		// Write all error logs to error.log
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
		// Write all logs to combined.log
		new winston.transports.File({
			filename: 'logs/combined.log',
		}),
	],
});

// Create a stream object for Morgan
logger.stream = {
	write: message => {
		logger.info(message.trim());
	},
};

class Logger {

	static info(message, meta = {}) {
		logger.info(message, meta);
	}

	static error(message, meta = {}) {
		logger.error(message, meta);
	}

	static warn(message, meta = {}) {
		logger.warn(message, meta);
	}

	static debug(message, meta = {}) {
		logger.debug(message, meta);
	}

	static http(message, meta = {}) {
		logger.http(message, meta);
	}

	static debug(message, meta) {
		logger.debug(message, meta);
	}

	static context(meta) {
		return logger.child(meta);
	}
}

module.exports = Logger;
