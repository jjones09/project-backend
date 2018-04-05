"use strict";

const finder = require('../lib/game-finder/gameFinder');

module.exports = router => {

    router.route('/:type/find')
        .get((req, res) => {
            let type = req.params.type;
            let title = req.query.title;

            finder.findGames(type, title).then(games => {
                res.send(games);
            });
        });
};