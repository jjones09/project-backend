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

    findEventsHostedBy: (host) => {
        let query = {host};
        return db.get('events', query);
    },

    findEventByID: (id) => {
        let query = {_id: id};
        return db.get('events', query);
    },

    // discoverEvents: (params) => {
    //
    //     // let query = {
    //     //     host: {$ne: params.user},
    //     //     attending: {$ne: params.user}
    //     // };
    //
    //     let query = {};
    //
    //     return db.get('events', query);
    // }
};

// let getDistance = (lat1, lat2, long1, long2) => {
//     let p = Math.PI / 180;
//     let cos = Math.cos;
//
//     let a = 0.5 - cos((lat2 - lat1) * p)/2 +
//         cos(lat1 * p) * cos(lat2 * p) *
//         (1 - cos((long2 - long1) * p))/2;
//
//     return 7917.51 * Math.asin(Math.sqrt(a));
// };