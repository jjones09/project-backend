"use strict";

module.exports = app => {

    app.get('/users', (req, res) => {
        res.send('Hit the users route');
    });
};