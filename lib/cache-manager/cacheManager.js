"use strict";

const redis = require('redis');

let client;

if (!client) {
    client = redis.createClient();
}

module.exports = {
    // addToken: (appID, uID, exp) => {
    //     client.setex(appId, exp, uID);
    // }
};