const vid = require('./extVideoGameSearch');
const board = require('./extBoardGameSearch');
const db = require('./dbGameSearch');

// Select the appropriate game finder based on the game type supplied
let getFinder = (gameType) => {
    return (gameType === 'board') ? board : vid;
};

// Tests if the title of the first game in the array
// is an exact match with the search query
let isExactMatch = (game, query) => {
    return (game && game.name.toLowerCase() === query.toLowerCase());
};

// Remove DB fields not required in the API response
let formatResults = (games) => {
    return games.map(game => {
        return {
            id: game._id,
            name: game.name,
            type: game.type,
            extURL: game.extURL,
            image: game.image
        }
    });
};

module.exports = {
    findGames: (type, query) => {
        return new Promise((resolve) => {
            db.findGames(type, query).then(games => {

                // If there's an exact title match in the DB results,
                // don't use API to find extra results
                if (games.length > 0 && isExactMatch(games[0], query)) {
                    resolve(formatResults(games));
                }
                else {
                    getFinder(type).findGames(query).then(apiRes => {

                        // Add games to the MongoDb collection
                        db.addGames(apiRes);

                        // Pull results from the DB again now that results have been added
                        db.findGames(type, query).then(games => {
                            resolve(formatResults(games));
                        });

                    });
                }
            });
        });
    }
};