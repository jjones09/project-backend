"use strict";

module.exports = app => {

    require('./users')(app);

    app.get('/', (req, res) => {
       res.send('Hello World!');
    });
};