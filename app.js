"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const db = require('./lib/database/database.js');

const port = process.env.PORT || 3000;

require('./routes/index')(app);

// Start app
app.listen(port, () => {
   console.log('Server listening on port %s', port);
});