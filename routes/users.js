"use strict";

module.exports = router => {

    router.route('/')
        .get((req, res) => {
            res.send('Hit the users route');
        });

    router.route('/:uId')
        .get((req, res) => {
            res.send('Hello user ' + req.params.uId);
        });
};