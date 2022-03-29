var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');

const Sequelize = require('sequelize');
const config = require(path.resolve('config/db.js'));

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const testDBFunction = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}


const testDll = ffi.Library(path.resolve('snark/build/src/libtest'), {
    'testlib': [
        "bool", [],
    ],
});

exports.index = (req, res) => {
    testDBFunction();
    var result = testDll.testlib();
    console.log(result);
    res.render('snark', { content: result });
}