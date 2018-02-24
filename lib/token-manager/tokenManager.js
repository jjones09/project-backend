"use strict";

const crypto = require('crypto');

// const fbTokenApiUrl = "https://graph.facebook.com/v2.11/me/accounts";

module.exports = {

    getAccessToken: (body) => {
        return body ? body.accessToken : '';
    },

    generatePsToken: () => {
        return crypto.randomBytes(20).toString('hex');
    }
};