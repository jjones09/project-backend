"use strict";

const firebase = require('firebase-admin');

let database;
let config = require('../../config/firebaseConfig');

if (!database) {
    firebase.initializeApp({
        credential: firebase.credential.cert(config.serviceKey),
        databaseURL: config.dbURL
    });
    database = firebase.database();
}

module.exports = {
    addUser: (uID, appID, accessToken) => {
        database.ref('users/' + uID).set({
            appID,
            accessToken
        });
    },

    findUser: (uID, appID) => {
        database.ref('users/' + uID).on('value', data => {
            return (data && (data.val().appID === appID));
        });
    }
};