"use strict";
const moment = require('moment');

let events = require('../lib/event-manager/eventManager');
let users = require('../lib/user-db-manager/userDbManager');
let games = require('../lib/game-finder/dbGameSearch');
let fbGraph = require('../lib/fb-graph/fbGraph');

let validateParams = eventObj => {

    let errCount = 0;

    let title = eventObj.title;
    if (!title || title.split(' ').join().length < 5) {
        errCount++;
    }

    if (!eventObj.dateTime || !moment(eventObj.dateTime, "ddd DD MMM H:mm").isValid()) {
        errCount++;
    }

    if (!eventObj.location || Object.keys(eventObj.location).length < 4) {
        errCount++;
    }

    let desc = eventObj.description;
    if (!desc || desc.split(' ').join().length < 5) {
        errCount++;
    }

    if (!eventObj.games || eventObj.games.length === 0 || eventObj.games.length > 5) {
        errCount++;
    }

    return errCount === 0;
};

module.exports = router => {

    router.route('/')
        .get((req, res) => {
            let host = req.query.host;

            events.findEventsHostedBy(host).then(results => {
                results.map(event => {
                    event.id = event._id;
                    delete event._id;
                    return event;
                });
                res.send(results);
            });
        });

    router.route('/')
        .post((req, res) => {
            let host = req.query.host;
            let body = req.body;

            if (validateParams(body)) {
                events.createEvent(body, host).then(result => {
                    if (result.insertedIds.length && result.insertedIds.length === 1) {
                        res.send({message: "Event created"});
                    }
                    else {
                        res.send({message: "Event creation failed"});
                    }
                });
            }
        });

    router.route('/')
        .put((req, res) => {
            let host = req.query.host;
            let id = req.query.id;
            let body = req.body;

            if (validateParams(body)) {
                events.editEvent(id, host, body).then(results => {
                    res.send({message: "Event created"});
                });
            }
        });

    router.route('/discover')
        .get((req, res) => {
            let lat = req.query.lat;
            let long = req.query.long;

            users.findUser(req.headers['user']).then(async user => {
                if (user) {
                    let opts = user.prefs;
                    let queryParams = {
                        user: user._id,
                        location: { lat, long }
                    };

                    // If the user wants friends only, get their list of friends
                    if (!opts.allHosts) {
                        queryParams.friends = await fbGraph.getFriends(user._id, user.fbAccessTkn);
                    }

                    // If the user is only interested in one game type, set it
                    if (opts.seeBoardGames ? !opts.seeVideoGames : opts.seeVideoGames) {
                        queryParams.gameType = opts.seeBoardGames ? 'board' : 'video';
                    }

                    res.send({events: await events.discoverEvents()});
                }
                else {

                }
            })

        })
};