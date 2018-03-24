"use strict";

const https = require('https');

// const userBase = require('../lib/firebase-interface/firebaseInterface');
const tokenMgr = require('../lib/token-manager/tokenManager');

const userDB = require('../lib/user-db-manager/userDbManager');


module.exports = router => {

    router.route('/:uID/get-token')
        .post((req, res) => {
            let uID = req.params.uID;

            userDB.findUser(uID).then(user => {
                if (!user) {

                    // TODO Refactor this out (common code) 1

                    let fbTkn = tokenMgr.getAccessToken(req.body);
                    tokenMgr.checkValidFacebookParams(uID, fbTkn).then(fbRes => {
                        if (fbRes.valid) {
                            let appTkn = tokenMgr.generatePsToken();
                            userDB.createUser(uID, fbTkn, fbRes.name, appTkn);
                            res.send({ token: appTkn, user: fbRes.name });
                        }
                        else {
                            res.send({ error: 'Invalid credentials provided' });
                        }
                    });
                }
                else {
                    let tokenExpired = tokenMgr.checkAppTokenExpiry(user.appTknIssued);
                    if (tokenExpired) {

                        // TODO Refactor this out (common code) 2

                        let fbTkn = tokenMgr.getAccessToken(req.body);
                        tokenMgr.checkValidFacebookParams(uID, fbTkn).then(fbRes => {
                            if (fbRes.valid) {
                                let appTkn = tokenMgr.generatePsToken();

                                userDB.updateAppToken(uID, fbTkn, appTkn);
                                res.send({token: appTkn, user: fbRes.name});
                            }
                            else {
                                res.send({error: 'Invalid credentials provided'});
                            }
                        });
                    }
                    else {
                        res.send({ token: user.appAccessTkn, user: user.name})
                    }
                }
            });
        });

    router.route('/:uID/profile-pic')
        .get((req, res) => {
            let uID = req.params.uID;

            let opts = {
                hostname: 'graph.facebook.com',
                path: '/v2.11/' + uID + '/picture?width=300&redirect=false'
            };

            https.get(opts, fbRes => {
                fbRes.on('data', function (data) {
                    let body = JSON.parse(data);
                    res.send({ url: body.data.url });
                });
            });
    });

    router.route('/:uID/verify-token')
        .post((req, res) => {
            let uID = req.params.uID;
            let tkn = tokenMgr.getAppToken(req.body);

            let validUser = userDB.findUser(uID, tkn);
            res.send({ validUser });
        });

    router.route('/:uID/get-prefs')
        .get((req, res) => {
            let uID = req.params.uID;
            userDB.findUser(uID).then(user => {
                res.send(user ?
                    {
                        seeVideo: user.prefs.seeVideoGames,
                        seeBoard: user.prefs.seeBoardGames,
                        allHosts: user.prefs.allHosts} :
                    {
                        error: "User preferences not found"
                    });
            });
        });

    router.route('/:uID/set-prefs')
        .post((req, res) => {
            if (req.body) {
                let uID = req.params.uID;
                let prefs = req.body.preferences;
                let amendments = {
                    seeVideoGames: prefs.seeVideo,
                    seeBoardGames: prefs.seeBoard,
                    allHosts: prefs.allHosts
                };
                userDB.updatePreferences(uID, amendments);
            }
        });
};