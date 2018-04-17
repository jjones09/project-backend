"use strict";

let should = require('chai').should();

let helper = require('../../lib/mongodb-interface/helper');

describe('MongoDbInterface helper Tests', function () {

    describe('buildConnectionString()', function () {

        it ('should construct a mongodb connection string in the correct format', function () {

            let config = {
                user: 'foo',
                pass: 'bar',
                hosts: 'host1:1234,host2:5678',
                opts: 'fizz=buzz'
            };

            let testStr = helper.buildConnectionString(config);

            testStr.should.be.equal('mongodb://foo:bar@host1:1234,host2:5678/app?fizz=buzz');
        });
    });
});