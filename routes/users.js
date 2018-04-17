"use strict";

const https = require('https');

const tokenMgr = require('../lib/token-manager/tokenManager');
const userDB = require('../lib/user-db-manager/userDbManager');

module.exports = router => {

    router.route('/:uID/log-in')
        .post((req, res) => {

            let uID = req.params.uID;
            let fbTkn = tokenMgr.getAccessToken(req.body);

            userDB.findUser(uID).then(user => {

                if (!user) {
                    tokenMgr.checkValidFacebookParams(uID, user.fbAccessTkn).then(fbRes => {
                        if (fbRes.isValid) {
                            let appTkn = tokenMgr.generatePsToken();
                            userDB.createUser(uID, fbTkn, fbRes.name, appTkn);

                            res.send({token: appTkn, user: fbRes.name});
                        }
                        else {
                            res.send({error: 'Invalid credentials provided'});
                        }
                    });
                }

                else {

                    let tkn = req.headers['access-token'];

                    if (tkn === 'null' || tkn !== user.appAccessTkn) {
                        res.send({error: 'Invalid credentials provided'});
                    }

                    else if (tokenMgr.checkAppTokenExpiry(user.appTknIssued)) {

                        tokenMgr.checkValidFacebookParams(uID, user.fbAccessTkn).then(fbRes => {
                            if (fbRes.isValid) {
                                let appTkn = tokenMgr.generatePsToken();

                                userDB.updateAppToken(uID, user.fbAccessTkn, appTkn);

                                res.send({token: appTkn, user: user.name,});
                            }
                            else {
                                res.send({error: 'Invalid credentials provided'});
                            }
                        });
                    }
                    else {
                        res.send({token: tkn, user: user.name,});
                    }
                }
            });
        });

    router.route('/:uID/verify-token')
        .post((req, res) => {
            let uID = req.params.uID;

        });

    router.route('/:uID/profile-pic')
        .get((req, res) => {
            let uID = req.params.uID;

            let opts = {
                hostname: 'graph.facebook.com',
                path: '/v2.11/' + uID + '/picture?width=300&redirect=false'
            };

            https.get(opts, fbRes => {
                fbRes.on('data', data => {
                    let body = JSON.parse(data);
                    res.send({ url: body.data.url });
                });
            });
    });

    router.route('/:uID/prefs')
        .get((req, res) => {
            let uID = req.params.uID;
            userDB.findUser(uID).then(user => {
                res.send(user ?
                    {
                        seeVideo: user.prefs.seeVideoGames,
                        seeBoard: user.prefs.seeBoardGames,
                        allHosts: user.prefs.allHosts,
                        radius: user.prefs.radius
                    } :
                    {
                        error: "User preferences not found"
                    });
            });
        });

    router.route('/:uID/prefs')
        .post((req, res) => {
            if (req.body) {
                let uID = req.params.uID;
                let prefs = req.body.preferences;
                let amendments = {
                    seeVideoGames: prefs.seeVideo,
                    seeBoardGames: prefs.seeBoard,
                    allHosts: prefs.allHosts,
                    radius: prefs.radius
                };
                userDB.updatePreferences(uID, amendments);
            }
            res.send(!!req.body);
        });

    router.route('/:uID/get-profile')
        .get((req, res) => {
            let uID = req.params.uID;
            userDB.getBasicProfile(uID).then(profile => {
                res.send(profile);
            });
        });

    router.route('/:uID/bio')
        .get((req, res) => {
           let uID = req.params.uID;
           userDB.getUserBio(uID).then(bio => {
               res.send(bio);
           })
        });

    router.route('/:uID/bio')
        .post((req, res) => {
            if (req.body && req.body.bio) {
                let uID = req.params.uID;
                userDB.updateUserBio(uID, req.body.bio).then(done => {
                    res.send({updated: (done.result && done.result.ok)});
                })
            }
        });
};