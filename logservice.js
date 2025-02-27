/** Initialise Winston Library */
const { createLogger, winston, format, transports  } = require('winston');
const path = require('path');

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
 
const consoleLogger = new transports.Console({
      level: 'debug',
})

/**Create Winston file logger to log to file */
const fileLogger = new transports.File({ 
    filename: './combined.log',
    format: format.json(), });

const nlogger = new createLogger({
    format: combine(
        label({ label: 'myapp2' }),
        timestamp(),
        myFormat
      ),
    level: 'debug',
    defaultMeta: { service: 'custom-server' },
    transports: [consoleLogger, fileLogger],
    exitOnError: false
});

module.exports = nlogger;
    