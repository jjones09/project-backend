"use strict";
let ObjectId = require('mongodb').ObjectId;
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
    },

    findGame: async (type, id) => {
        // Find game with input id
        let res = await db.get('games', {
            type: type,
            _id: ObjectId(id)
        });

        return res[0];
    },
};