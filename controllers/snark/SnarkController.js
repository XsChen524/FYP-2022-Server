var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');
var redis = require('redis');

const testDll = ffi.Library(path.resolve('snark/build/src/libtest'), {
    'testlib': [
        "bool", [],
    ],
});

function testRedis() {
    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        await client.set('key', 'value');
        const value = await client.get('key');
        console.log(value);
    })();
}

var test = (req, res) => {
    testRedis();
    testDBFunction();
    var result = testDll.testlib();
    console.log(result);
}

/**
 * Store the secret string and userId into Redis
 * userId: secStr
 * @param {*} req 
 * @param {*} res 
 */

exports.StoreSecretStr = (req, res) => {
    var userId = req.query.userId;
    var secStr = req.query.secStr;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();

        await client.set(userId, secStr);
        //await client.HSET(userId, 'isScanned', false);
        //await client.HSET(userId, 'EX', 1800);

        //await client.hGetAll(userId);
    })();

    res.send(JSON.stringify({ 'status': 'succeed', 'userId': userId, 'secStr': secStr }));
}

exports.index = (req, res) => {
    res.render('snarkViews/snark', { content: "snark page" });
}