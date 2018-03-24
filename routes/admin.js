"use strict";

const fs = require('fs');

const auth = require('http-auth');

// TODO Integrate actual credentials for admin access
let basic = auth.basic(
    { realm: "Admin"},
    (user, pass, cb) => {
        cb(user === "foo" && pass === "bar");
    });

let middleware = auth.connect(basic);

module.exports = router => {

    router.route('/logs')
        .get(middleware, (req, res) => {
            res.send(fs.readFileSync('./app.log'));
        });
};