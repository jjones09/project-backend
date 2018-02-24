"use strict";

const https = require('https');

const tokenMgr = require('../lib/token-manager/tokenManager');

module.exports = router => {

    router.route('/')
        .get((req, res) => {
            res.send('Hit the users route');
        });

    router.route('/:uID/get-token')
        .post((req, res) => {
            let uID = req.params.uID;

            let accessTkn = tokenMgr.getAccessToken(req.body);

            let opts = {
                hostname: 'graph.facebook.com',
                path: '/v2.11/me?fields=id,name&access_token=' + accessTkn
            };

            https.get(opts, fbRes => {
                if (fbRes.statusCode === 200) {
                    fbRes.on('data', function (data) {
                        let body = JSON.parse(data);
                        if (uID === body.id) {
                            let token = tokenMgr.generatePsToken();
                            res.send({ token, user: body.name });
                        }
                        else {
                            res.send({ error: 'Invalid access token' });
                        }
                    });
                }
            });
        });

    router.route('/:uID/profile-pic')
        .get((req, res) => {
            let uID = req.params.uID;

            let opts = {
                hostname: 'graph.facebook.com',
                path: '/v2.11/' + uID + '/picture?width=150&redirect=false'
            };

            https.get(opts, fbRes => {
                fbRes.on('data', function (data) {
                    let body = JSON.parse(data);
                    res.send({ url: body.data.url });
                });
            });
    });
};