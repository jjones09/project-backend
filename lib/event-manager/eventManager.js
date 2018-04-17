"use strict";

let ObjectId = require('mongodb').ObjectId;
const db = require('../mongodb-interface/mongoDbInterface');

module.exports = {

    createEvent: (event, host) => {
        // Add a new event to the DB
        let newEvent = event;
        newEvent.host = host;
        newEvent.attendees = [];

        return db.insert('events', event);
    },

    editEvent: (eventID, host, changes) => {
        // Edit an existing event in the database
        return db.update('events', {_id: ObjectId(eventID), host: host}, changes);
    },

    findEvents: (host) => {
        let query = {host};
        return db.get('events', query)
    }
};