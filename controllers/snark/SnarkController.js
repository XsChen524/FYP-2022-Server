var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');
var redis = require('redis');
const exp = require('constants');

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
        try {
            await client.DEL(userId);
            await client.HSET(userId, {
                secStr: secStr,
                isScanned: false
            });
            await client.expire(userId, 1800);
        } catch (err) {
            console.log(err);
        }
    })();

    res.send(JSON.stringify({ 'status': 'succeed', 'userId': userId, 'secStr': secStr }));
}

exports.MobileScanQr = (req, res) => {
    var userId = req.query.userId;
    var status = req.query.status;
    var secStr = req.query.secStr;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        await client.hGetAll(userId, function(err, obj) {
            if (err) console.log(err);
            else {
                console.log(obj);
            }
        });
    })();

    res.send('Hello');
}

exports.index = (req, res) => {
    res.render('snarkViews/snark', { content: "snark page" });
}