"use strict";

const express = require('express');
const app = express();

const db = require('./lib/database/database.js');

const port = process.env.PORT || 3000;

require('./routes/index')(app);

app.listen(port, () => {
   console.log('Server listening on port %s', port);
});