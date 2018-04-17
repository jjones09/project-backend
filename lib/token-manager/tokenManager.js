"use strict";

const crypto = require('crypto');
const https = require('https');
const moment = require('moment');

module.exports = {

    getAccessToken: (body) => {
        return body ? body.accessToken : '';
    },

    generatePsToken: () => {
        return crypto.randomBytes(20).toString('hex');
    },

    getAppToken: (body) => {
        return body ? body.token : '';
    },

    checkValidFacebookParams : async (uID, tkn) => {
        let fbData = await getUIDFromFacebook(tkn);
        return {
            name: fbData.name,
            isValid: (!fbData.error && fbData.id === uID)
        };
    },

    checkAppTokenExpiry: (timestamp) => {
        // Check if 24 hours have elapsed since last app token was issued
        return (moment() > moment(timestamp).add(1, 'days'));
    }
};

function getUIDFromFacebook (tkn)  {
    return new Promise((resolve) => {
        let opts = {
            hostname: 'graph.facebook.com',
            path: '/v2.11/me?fields=id,name&access_token=' + tkn
        };

        https.get(opts, fbRes => {
            fbRes.on('data', function (data) {
                resolve(JSON.parse(data));
            });
        });
    });
}