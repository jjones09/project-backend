"use strict";

let async = require('async');
let changeCase = require('change-case');
let express = require('express');
let routeFiles = require('require-dir')();
let moment = require('moment');

let logger = require('../lib/logger/logger');
let validator = require('../lib/token-validator/tokenValidator');

let app;

let mapRoute = fileName => {
    let router = express.Router();
    require('./' + fileName)(router);
    app.use('/' + changeCase.paramCase(fileName), router);
};

let sendBadResponse = (req, res) => {
    logger.warn('BAD ACCESS TOKEN: ' + req.method + ' to ' + req.originalUrl + ' at ' + moment().format());
    res.send({
        status: 401,
        message: "Bad access token received"
    });
};

module.exports = appIn => {
    app = appIn;

    // Middleware for all routes
    app.use(async (req, res, next) => {

        let isAdmin = req.originalUrl === '/admin/logs' || req.originalUrl === '/favicon.ico';

        logger.info(req.method + ' to ' + req.originalUrl + ' at ' + moment().format());

        if (req.originalUrl.split('/')[3] === 'log-in' ||
            isAdmin ||
            await validator.validate(req.headers['user'], req.headers['access-token'])) {

            next();
        }

        else {
            sendBadResponse(req, res);
        }
    });

    async.map(Object.keys(routeFiles), mapRoute);
};