"use strict";

const mongodb = require('mongodb');

const connString = require('../../config/dbConnection.json');

let connection;

let getConnection = () => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            mongodb.connect(connString, (err, db) => {
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

module.exports = {

    get: (coll, query) => {
        return new Promise((resolve, reject) => {
            getConnection().then((db) => {
                let collection = db.collection(coll);
                console.log('Got collection!');
                if (collection) {
                    collection.find(query).toArray((err, docs) => {
                        if (!err) {
                            resolve(docs);
                        }
                        else {
                            reject(err);
                        }
                    })
                }
            });
        });
    }
};

connection = getConnection();