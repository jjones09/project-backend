"use strict";

const db = require('../mongodb-interface/mongoDbInterface');

module.exports = {

    validate: async (uID, token) => {
        let users = await db.get('users', {_id: uID, appAccessTkn: token});
        // Return first element in users array
        // Array will only ever contain 0 or 1 elements
        return users.length === 1;
    }
};