"use strict";
const moment = require('moment');

let events = require('../lib/event-manager/eventManager');

let validateParams = eventObj => {

    let errCount = 0;

    let title = eventObj.title;
    if (!title || title.split(' ').join().length < 5) {
        errCount++;
    }

    if (!eventObj.dateTime || !moment(eventObj.dateTime, "ddd DD MMM H:mm").isValid()) {
        errCount++;
    }

    if (!eventObj.location || Object.keys(eventObj.location).length < 4) {
        errCount++;
    }

    let desc = eventObj.description;
    if (!desc || desc.split(' ').join().length < 5) {
        errCount++;
    }

    if (!eventObj.games || eventObj.games.length === 0 || eventObj.games.length > 5) {
        errCount++;
    }

    return errCount === 0;
};

module.exports = router => {

    router.route('/')
        .get((req, res) => {
            let host = req.query.host;

            events.findEvents(host).then(results => {
                results.map(event => {
                    event.id = event._id;
                    delete event._id;
                    return event;
                });
                res.send(results);
            });
        });

    router.route('/')
        .post((req, res) => {
            let host = req.query.host;
            let body = req.body;

            if (validateParams(body)) {
                events.createEvent(body, host).then(result => {
                    if (result.insertedIds.length && result.insertedIds.length === 1) {
                        res.send({message: "Event created"});
                    }
                    else {
                        res.send({message: "Event creation failed"});
                    }
                });
            }
        });

    router.route('/')
        .put((req, res) => {
            let host = req.query.host;
            let id = req.query.id;
            let body = req.body;

            if (validateParams(body)) {
                events.editEvent(id, host, body).then(results => {
                    res.send({message: "Event created"});
                });
            }
        });


};