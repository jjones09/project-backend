"use strict";

const https = require('https');

const accessToken = require('../lib/access-token/accessToken');

module.exports = router => {

    router.route('/')
        .get((req, res) => {
            res.send('Hit the users route');
        });

    router.route('/getToken')
        .post((req, res) => {

            let params = accessToken.getParams(req.body);

            let opts = {
                hostname: 'graph.facebook.com',
                path: '/v2.11/me?fields=id,name&access_token=' + params.accessToken
            };

            https.get(opts, res => {
                if (res.statusCode === 200) {
                    res.on('data', function (data) {
                        let body = JSON.parse(data);
                        if (body.id === params.uID) {
                            let token = accessToken.generatePsToken();
                            res.send({ token, user: body.name });
                        }
                        else {
                            res.send({ error: 'Invalid access token' });
                        }
                    });
                }
            });
        });
};