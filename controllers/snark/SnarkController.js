var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');
var redis = require('redis');
var ref = require('ref-napi');

const snarkDll = ffi.Library(path.resolve('snark/build/src/libcertificate.so'), {
    'GenerateProof': [
        'string', ['int', 'string', 'string'],
    ],
    'VerifyProof': [
        'bool', ['int', 'string', 'string'],
    ]
});

async function SnarkGenerateProof(userId, infoHash, secStr) {
    var rootHash = await snarkDll.GenerateProof(userId, infoHash, secStr);
    console.log('Get roothash: ' + rootHash);

    //update root and hasProof in redis
    const client = redis.createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    await client.HSET(userId, {
        root: rootHash,
        hasProof: true,
    });
    client.quit();

    return rootHash
}

async function SnarkVerifyProof(userId, secStr, rootHash) {
    var isPassed = await snarkDll.VerifyProof(userId, secStr, rootHash);
    console.log('Get result: ' + isPassed);

    //update root and hasProof in redis
    const client = redis.createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    await client.HSET(userId, {
        hasVerified: true,
        isPassed: isPassed
    });
    client.quit();

    return isPassed;
}

/**
 * Run the snark programme, and update the value in redis
 * {
 *  info: info Hash
 *  hasProof: bool, true if proof generated and get the roothash
 *  root: merkle root hash, return by C GenerateProof
 *  hasVerified: bool, true if the verification succeed and result returned
 *  isPassed: bool, if pass the verification
 *  
 * }
 * @param {Integer} userId 
 */
exports.RunSnark = (req, res) => {
    var userId = req.query.userId;
    console.log('Going to run snark');

    //Get vals from redis
    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        client.hGetAll(userId).then(
            (userObj) => {
                console.log(userObj);
                var infoHash = userObj.info;
                var secStr = userObj.secStr;

                if (userObj.hasVerified == false) {
                    SnarkGenerateProof(userId, infoHash, secStr).then(
                        (rootHash) => {
                            console.log(rootHash);
                            SnarkVerifyProof(userId, secStr, rootHash).then(
                                () => {
                                    res.send(JSON.stringify({ status: 'done' }));
                                }
                            )
                        }
                    )
                } else {
                    res.send(JSON.stringify({ status: 'done' }));
                }
            }
        )
        client.quit();
    })();
}

/**
 * Get userId, secStr, infoHash from redis
 * @param {Integer} userId
 */
exports.CheckUserInfo = (req, res) => {
    var userId = req.query.userId;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        try {
            //Check whether isScanned is true
            client.hGetAll(userId).then(
                (userObj) => {
                    var infoHash = userObj.info;
                    var secStr = userObj.secStr;
                    res.send(JSON.stringify({
                        userId: userId,
                        secStr: secStr,
                        info: infoHash
                    }))
                }
            );
        } catch (err) {
            console.log(err);
        }
    })();
}

/**
 * Check whether the proof has been generated
 * @param {Integer} userId
 */
exports.CheckProof = (req, res) => {
    var userId = req.query.userId;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        try {
            //Check whether isScanned is true
            client.hGetAll(userId).then(
                (userObj) => {
                    console.log(userObj.root);
                    if (userObj.hasProof == 'true') {
                        res.send(JSON.stringify({
                            hasProof: true,
                            rootHash: userObj.root
                        }))
                    } else {
                        res.send(JSON.stringify({
                            hasProof: false,
                            rootHash: ''
                        }))
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
    })();
}

/**
 * Check whether pass the verification
 * @param {Integer} userId
 */
exports.CheckVerification = (req, res) => {
    var userId = req.query.userId;

    (async() => {
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        try {
            //Check whether isScanned is true
            client.hGetAll(userId).then(
                (userObj) => {

                    res.send(JSON.stringify({
                        hasVerified: (userObj.hasVerified === 'false' ? false : true),
                        isPassed: (userObj.isPassed === 'false' ? false : true)
                    }))

                }
            );
        } catch (err) {
            console.log(err);
        }
    })();
}

/**
 * Store the secret string and userId into Redis
 * Initialize redis hashtable
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
                isScanned: false,
                info: '',
                root: '',
                hasProof: false,
                hasVerified: false,
                isPassed: false,
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
    var infoHash = req.query.info;

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
                                isScanned: true,
                                info: infoHash,
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