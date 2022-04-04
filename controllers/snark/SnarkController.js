var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');
var redis = require('redis');
var ref = require('ref-napi');

const testDll = ffi.Library(path.resolve('snark/build/src/libcertificate.so'), {
    'GenerateProof': [
        'string', ['int', 'string', 'string'],
    ],
    'VerifyProof': [
        'bool', ['int', 'char *', 'char *'],
    ]
});

var test = (req, res) => {
    testDBFunction();
    var result = testDll.testlib();
    console.log(result);
}

exports.TestSnark = (req, res) => {
    (async() => {
        var rootHash = await testDll.GenerateProof(1, 'secStr', 'randomkey');
        console.log(rootHash);
        (async() => {
            var isVerified = await testDll.VerifyProof(1, 'randomkey', rootHash.toString());
            console.log(isVerified);
            res.send(isVerified);
        })();
    })();
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
            client.quit();
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
                            client.quit()
                            res.send(JSON.stringify({ status: true }));
                        }
                    })();
                }
            )
        })();
    }
}

/**
 * Send by browser repeatedly, to check whether the qrcode is scanned
 * @param {*} req 
 * @param {*} res JSON, {isScanned: true} if the qrcode has been scanned
 */
exports.CheckScanQrCode = (req, res) => {
    var userId = req.query.userId;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        try {
            //Check whether isScanned is true
            client.hGetAll(userId).then(
                (userObj) => {
                    if (userObj.isScanned == 'true') {
                        res.send(JSON.stringify({ isScanned: true }));
                    } else {
                        res.send(JSON.stringify({ isScanned: false }))
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
    })();
}

exports.index = (req, res) => {
    res.render('snarkViews/snark', { content: "snark page" });
}

exports.Result = (req, res) => {
    res.render('snarkViews/snarkResult', { content: 'snark result' });
}