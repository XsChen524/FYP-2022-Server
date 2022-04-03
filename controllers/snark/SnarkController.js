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

/**
 * Receive the request from mobile, telling that the QR has been scanned
 * @param {*} req 
 * @param {*} res 
 */

exports.MobileScanQr = (req, res) => {
    var userId = req.query.userId;
    var status = req.query.status;
    var secStr = req.query.secStr;

    if (status == "success") {
        (async() => {
            const client = redis.createClient();
            client.on('error', (err) => console.log('Redis Client Error', err));
            await client.connect();
            client.hGetAll(userId).then(
                (userObj) => {
                    (async() => {
                        console.log(userObj.secStr);
                        if (userObj.secStr == secStr) {
                            await client.HSET(userId, {
                                isScanned: true
                            });
                            res.send(JSON.stringify({ status: true }));
                        }
                    })();
                }
            )
        })();
    }
}

exports.index = (req, res) => {
    res.render('snarkViews/snark', { content: "snark page" });
}