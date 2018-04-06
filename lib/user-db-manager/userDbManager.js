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
            bio: 'Hey, let\'s play some games!',
            prefs: {
                seeVideoGames: true,
                seeBoardGames: true,
                allHosts: false,
                radius: 10
            },
            activeHosting: [],
            activeAttending: [],
            totalHosted: 0,
            totalAttended: 0
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

    updatePreferences: (uID, prefs) => {
        db.update('users', {_id: uID},
            { $set: {
                prefs: prefs
            }
        });
    },

    getBasicProfile: async (uID) => {
        let users = await db.get('users', {_id: uID});
        let user = users[0];
        return {
            hosting: user.activeHosting.length,
            attending: user.activeAttending.length,
            totalHosted: user.totalHosted,
            totalAttended: user.totalAttended
        }
    },

    getUserBio: async (uID) => {
        let users = await db.get('users', {_id: uID});
        let user = users[0];
        return {
            bio: user.bio
        }
    },

    updateUserBio: async (uID, bio) => {
        db.update('users', {_id: uID},
            { $set: {
                    bio: bio
                }
            });
    }
};