"use strict";

const db = require('../mongodb-interface/mongoDbInterface');

let compareScore = (a, b) => {
    return a.score === b.score ?
        0 : ((a.score > b.score) ? -1 : 1);
};

module.exports = {

    findGames: async (type, name) => {
        // Find games with the same type
        // Add a score field to
        let games = await db.get('games', {
            type: type,
            $text: { $search: name}
        }, {
            score: { $meta: 'textScore' }
        });

        games.sort(compareScore);
        return games;
    },

    addGames: (games) => {
        db.insert('games', games);
    }
};