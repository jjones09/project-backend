const giantBomb = require('giant-bomb');

const apiKey = require('../../giantBomb').key;
const userAgent = 'PlaySpark - social gamer platform';

let api = new giantBomb(apiKey, userAgent);

module.exports = {
    findGames: (title) => {

        return new Promise((resolve, reject) => {
            api.search(
                {
                    query: title,
                    fields: ['name', 'id', 'image', 'site_detail_url'],
                    limit: 10,
                    resources: ['game']
                },

                (err, res, body) => {
                    if (!err && res.statusCode === 200) {
                        let games = body.results.map(game => {
                            return {
                                name: game.name,
                                type: 'video',
                                extURL: game.site_detail_url,
                                image: (game.image.original_url || game.image.medium_url)
                            }
                        });
                        resolve(games);
                    }
                    else {
                        reject(err);
                    }
            });
        });
    }
};