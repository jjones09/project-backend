const bgg = require('boardgamegeek');

// Build a URL to BoardGameGeek based on the ID
let buildBggURL = (id) => {
    return 'https://boardgamegeek.com/boardgame/' + id;
};

module.exports = {
    findGames: (title) => {

        return new Promise((resolve, reject) => {
            bgg.getBoardGame(title).then(res => {
                if (res) {
                    // Map the API response to a standard format
                    let gameObj = {
                        name: res.name,
                        type: 'board',
                        extURL: buildBggURL(res.id),
                        image: res.image
                    };
                    resolve([gameObj]);
                }
                else {
                    reject({error: 'No results were found'});
                }
            });
        });
    }
};