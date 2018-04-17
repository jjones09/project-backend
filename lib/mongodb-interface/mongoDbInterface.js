"use strict";

const mongodb = require('mongodb');
const helper = require('./helper');
const logger = require('../logger/logger');

const connConf = require('../../mongodbConfig.json');

let connection;

let getConnection = () => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            mongodb.connect(helper.buildConnectionString(connConf), (err, db) => {
                if (err) {
                    logger.warn('Error connection to mongodb-interface: %s', err.message);
                    reject(err.message);
                }
                else {
                    logger.info('Connected to mongodb');
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
        getConnection().then(db => {
           let collection = db.collection(coll);
           if (collection) {
               logger.info('Retrieved collection \'%s\'', coll);
               resolve(collection);
           }
           else {
               reject('Unable to retrieve collection \'%s\'', coll);
           }
        });
    });
};

module.exports = {

    get: (coll, query, opts) => {
        return new Promise((resolve, reject) => {
            getCollection(coll).then(collection => {
                if (typeof collection === 'string') {
                    logger.info('Error - %s', collection);
                }
                else {
                    collection.find(query, opts).toArray((err, docs) => {
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
                    logger.info('Error - %s', collection);
                }
                else {
                    collection.insert(doc, opts).then(result => {
                        resolve(result);
                    });
                }
            });
        });
    },

    update: (coll, doc, update, opts) => {
        return new Promise((resolve) => {
           getCollection(coll).then(collection => {
               if (typeof collection === 'string') {
                   logger.info('Error - %s', collection);
               }
               else {
                   collection.update(doc, update, opts).then(result => {
                       resolve(result);
                   });
               }
           });
        });
    }
};

connection = getConnection();