"use strict";

const mongodb = require('mongodb');

const connConf = require('../../config/dbConnection.json');

let connection;

let buildConnectionString = () => {
    return "mongodb://" + connConf.user + ":" + connConf.pass +
        "@" + connConf.hosts.join(',') + '/app?' + connConf.opts.join('&');
};

let getConnection = () => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            mongodb.connect(buildConnectionString(), (err, db) => {
                if (err) {
                    console.log('Error connection to database: %s', err.message);
                    reject(err.message);
                }
                else {
                    console.log('Connected to database');
                    connection = db;
                    resolve(connection);
                }
            });
        }
        else {
            resolve(connection);
        }
    });
};

let getCollection = (coll) => {
    return new Promise((resolve, reject) => {
        getConnection().then((db) => {
           let collection = db.collection(coll);
           if (collection) {
               console.log('Retrieved collection \'%s\'', coll);
               resolve(collection);
           }
           else {
               reject('Unable to retrieve collection \'%s\'', coll);
           }
        });
    });
};

module.exports = {

    get: (coll, query) => {
        return new Promise((resolve, reject) => {
            getCollection(coll).then(collection => {
                if (typeof collection === 'string') {
                    console.log('Error - %s', collection);
                }
                else {
                    collection.find(query).toArray((err, docs) => {
                       if (err) {
                           reject(err);
                       }
                       else {
                           resolve(docs);
                       }
                    });
                }
            });
        });
    },

    insert: (coll, doc, opts) => {
        return new Promise((resolve) => {
            getCollection(coll).then(collection => {
                if (typeof collection === 'string') {
                    console.log('Error - %s', collection);
                }
                else {
                    collection.insert(doc, opts).then(result => {
                        resolve(result);
                    });
                }
            });
        });
    }
};

connection = getConnection();