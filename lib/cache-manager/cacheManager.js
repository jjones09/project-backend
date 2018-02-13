"use strict";

const crypto = require('crypto');

const fbTokenApiUrl = "https://graph.facebook.com/v2.11/me/accounts";

module.exports = {

    getParams: (body) => {
        return {
            accessToken: body ? body.accessToken : '',
            uID: body ? body.uID : ''
        };
    },

    generatePsToken: () => {
        return crypto.randomBytes(20).toString('hex');
    }
};