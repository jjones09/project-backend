"use strict";

const finder = require('../lib/game-finder/gameFinder');

module.exports = router => {

    router.route('/:type')
        .get((req, res) => {
            let type = req.params.type;
            let id = req.query.id;
            let title = req.query.title;

            if (!id) {
                finder.findGames(type, title).then(games => {
                    res.send(games);
                });
            }
            else {
                finder.findByID(type, id).then(game => {
                    game.id = game._id;
                    delete game._id;
                    res.send(game);
                })
            }
        });
};