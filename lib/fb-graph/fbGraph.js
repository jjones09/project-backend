"use strict";

const https = require('https');

module.exports = {

    getFriends: (uID, fbTkn) => {
        return new Promise(resolve => {
            let apiRoute = uID + '/friends?limit=1000';

            makeGetRequest(apiRoute, fbTkn).then(res => {

                let friendList = res.data.map(friend => friend.id);
                resolve(friendList);
            });
        });
    }
};

let makeGetRequest = (path, tkn) => {

    return new Promise((resolve) => {
        let opts = {
            hostname: 'graph.facebook.com',
            path: '/v2.11/' + path + '&access_token=' + tkn
        };

        https.get(opts, fbRes => {
            fbRes.on('data', function (data) {
                resolve(JSON.parse(data));
            });
        });
    });
};