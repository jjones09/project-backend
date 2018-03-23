"use strict";

const https = require('https');

// const userBase = require('../lib/firebase-interface/firebaseInterface');
const tokenMgr = require('../lib/token-manager/tokenManager');

const userDB = require('../lib/user-db-manager/userDbManager');


module.exports = router => {

    router.route('/logs')
        .get((req, res) => {

        });
};