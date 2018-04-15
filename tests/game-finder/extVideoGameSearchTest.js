"use strict";

let should = require('chai').should();
let proxyquire = require('proxyquire');

let vid = require('../../lib/game-finder/extVideoGameSearch');

describe('extVideoGameSearch Tests', function () {

    describe('findGames()', function () {

        it ('should find games based off an input query', function () {

            let query = 'mario';


            let search = sinon.stub(api, 'search');
            search.yields('', {statusCode: 200}, {
                results: [
                    {
                        name: 'mario kart',
                        site_detail_url: 'www.foo.com',
                        image: {
                            original_url: '',
                            medium_url: 'www.medurl.com/image'
                        }
                    }
                ]
            });

            vid.findGames(query).then(results => {
                results.length.should.be.equal(1);
            })
        });
    });
});