"use strict";

const fs = require("fs");

module.exports = router => {

    router.route('/logs')
        .get((req, res) => {
            res.send(fs.readFileSync('./app.log'));
        });
};