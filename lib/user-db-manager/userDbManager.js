"use strict";

const moment = require('moment');

const db = require('../mongodb-interface/mongoDbInterface');

module.exports = {

    findUser: async (uID) => {
        let users = await db.get('users', {_id: uID});
        // Return first element in users array
        // Array will only ever contain 0 or 1 elements
        return users[0];
    },

    createUser: (uID, fbTkn, name, appTkn) => {
        // Add a new user to the db
        // with default values in place
        let userObj = {
            _id: uID,
            name: name,
            fbAccessTkn: fbTkn,
            appAccessTkn: appTkn,
            appTknIssued: moment().format(),
            prefs: {
                seeVideoGames: true,
                seeBoardGames: true,
                allHosts: false
            },
            hosting: [],
            attending: []
        };
        db.insert('users', userObj);
    },

    updateAppToken: (uID, fbTkn, appTkn) => {
        db.update('users', {_id: uID},
            { $set: {
                fbAccessTkn: fbTkn,
                appAccessTkn: appTkn,
                appTknIssued: moment().format()
            }
        });
    },

    updatePreferences: (prefs) => {
        db.update('users', {_id: uID},
            { $set: {
                prefs: {
                    seeVideoGames: prefs.video,
                    seeBoardGames: prefs.board,
                    allHosts: prefs.all
                }
            }
        });
    }
};