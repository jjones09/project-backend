"use strict";

let async = require('async');
let changeCase = require('change-case');
let express = require('express');
let routeFiles = require('require-dir')();

let app;

let mapRoute = fileName => {
    let router = express.Router();
    require('./' + fileName)(router);
    app.use('/' + changeCase.paramCase(fileName), router);
};

module.exports = appIn => {
    app = appIn;

    async.map(Object.keys(routeFiles), mapRoute);
};