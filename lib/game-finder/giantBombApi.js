const giantBomb = require('giant-bomb');

const apiKey = require('../../giantBomb').key;
const userAgent = 'PlaySpark - social gamer platform';

module.exports = {
    connect: () => {
        return new giantBomb(apiKey, userAgent);
    }
};