"use strict";

const express = require('express');
const app = express();

const logger = require('./lib/logger/logger');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Require db to establish connection on server start
const db = require('./lib/mongodb-interface/mongoDbInterface.js');

const port = process.env.PORT || 3000;

require('./routes/index')(app);

// Start app
app.listen(port, () => {
   logger.info('Server listening on port %s', port);
});