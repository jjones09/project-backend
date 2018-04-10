"use strict";

const db = require('../mongodb-interface/mongoDbInterface');

module.exports = {

    createEvent: (event, host) => {
        // Add a new event to the DB
        let newEvent = event;
        newEvent.host = host;
        newEvent.attendees = [];

        db.insert('events', event);
    }
};