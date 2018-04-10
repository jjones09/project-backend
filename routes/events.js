"use strict";

let events = require('../lib/event-manager/eventManager');

module.exports = router => {

    router.route('/create')
        .post((req, res) => {
            let host = req.query.host;
            let body = req.body;

            console.log('body :' + JSON.stringify(body));

            console.log('Hello');

            events.createEvent(body, host);
        });
};