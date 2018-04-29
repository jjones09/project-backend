"use strict";

let should = require('chai').should();

let finder = require('../../lib/game-finder/gameFinder');

describe('gameFinder Tests', function () {

    describe('isExactMatch()', function () {

        it ('should return true if the game title matches the query', function () {

            let query = 'mario';
            let game = {name: 'mario'};

            finder.isExactMatch(game, query).should.be.equal(true);
        });

        it ('should return true if the titles match case insensitive', function () {

            let query = 'mArIo';
            let game = {name: 'MaRiO'};

            finder.isExactMatch(game, query).should.be.equal(true);
        });

        it ('should return false if the titles don\'t match', function () {

            let query = 'mario';
            let game = {name: 'sonic'};

            finder.isExactMatch(game, query).should.be.equal(false);
        });

        it ('should return false if game is undefined', function () {

            let query = 'mario';
            let game = '';

            finder.isExactMatch(game, query).should.be.equal(false);
        });

        it ('should return false if game.name is undefined', function () {

            let query = 'mario';
            let game = {};

            finder.isExactMatch(game, query).should.be.equal(false);
        });
    });

    describe('formatResults()', function () {

        it ('should retain the expected input properties', function () {

            let games = [{
                _id: '1234',
                name: 'mario',
                type: 'board',
                extURL: 'foo.com',
                image: 'bar.com/image'
            }];

            let formatted = finder.formatResults(games);

            formatted.length.should.be.equal(1);
            formatted[0].should.have.property('id', '1234');
            formatted[0].should.have.property('name', 'mario');
            formatted[0].should.have.property('type', 'board');
            formatted[0].should.have.property('extURL', 'foo.com');
            formatted[0].should.have.property('image', 'bar.com/image');
        });

        it ('should lose any unexpected input properties', function () {

            let games = [{
                _id: '1234',
                badProp: 'I shouldn\'t be here'
            }];

            let formatted = finder.formatResults(games);

            formatted.length.should.be.equal(1);
            formatted[0].should.not.have.property('badProp');
        });

        it ('should return empty if input is empty', function () {

            let games = [];

            let formatted = finder.formatResults(games);

            formatted.length.should.be.equal(0);
        });
    });

    describe('getFinder()', function () {

        it ('should return empty if input is empty', function () {

            let games = [];

            let formatted = finder.formatResults(games);

            formatted.length.should.be.equal(0);
        });
    });
});