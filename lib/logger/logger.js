const winston = require('winston');

// Set winston transport to console if in a non-prod env
// Set to app.log if in production
let getTransport = () => {
    return (process.env.NODE_ENV === 'production') ?
        new winston.transports.File({
            filename: 'app.log',
            timestamp: true
        }) :
        new winston.transports.Console;
};

module.exports = new winston.Logger({
   transports: [
       getTransport()
   ]
});
