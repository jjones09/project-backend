"use strict";

module.exports = {

    // Returns a mongodb connection string
    buildConnectionString: (connConf) => {
        return "mongodb://" + connConf.user + ":" + connConf.pass +
            "@" + connConf.hosts + '/app?' + connConf.opts;
    }

};