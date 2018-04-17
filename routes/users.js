"use strict";

const https = require('https');

const tokenMgr = require('../lib/token-manager/tokenManager');
const userDB = require('../lib/user-db-manager/userDbManager');

module.exports = router => {

    router.route('/:uID/log-in')
        .post((req, res) => {

            // Get the User ID from the route params
            let uID = req.params.uID;

            if (!req.headers['access-token']) {
                // Check if the user exists in the app DB
                userDB.findUser(uID).then(user => {

                    // If the user doesn't exist, first verify the supplied info with the FB API
                    // Then create a new user in the DB
                    if (!user) {

                        let fbTkn = tokenMgr.getAccessToken(req.body);
                        tokenMgr.checkValidFacebookParams(uID, fbTkn).then(fbRes => {
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

                    // If the user does exist, first check the App-level token
                    // If this token is still recent (last 24 h) then go ahead
                    // If not, revalidate using FB API and issue new one if cleared
                    else {
                        let tokenExpired = tokenMgr.checkAppTokenExpiry(user.appTknIssued);

                        if (tokenExpired) {
                            let fbTkn = tokenMgr.getAccessToken(req.body);

                            tokenMgr.checkValidFacebookParams(uID, fbTkn).then(fbRes => {

                                if (fbRes.isValid) {
                                    let appTkn = tokenMgr.generatePsToken();

                                    userDB.updateAppToken(uID, fbTkn, appTkn);
                                    res.send({
                                        token: appTkn,
                                        user: user.name,
                                    });
                                }
                                else {
                                    res.send({
                                        error: 'Invalid credentials provided'
                                    });
                                }
                            });
                        }
                        else {
                            res.send({
                                token: user.appAccessTkn,
                                user: user.name
                            });
                        }
                    }
                });
            }
            else {

                // TODO FIX THIS!
                let tkn = tokenMgr.getAppToken(req.body);

                userDB.findUser(uID, tkn).then(user => {
                    let response = user ? {

                        } :{};
                    res.send({ validUser: !!user });
                });
            }
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
                userDB.updateUserBio(uID, req.body.bio);
            }
        });
};