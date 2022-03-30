var express = require('express');
var path = require('path');
var ffi = require('ffi-napi');

const testDll = ffi.Library(path.resolve('snark/build/src/libtest'), {
    'testlib': [
        "bool", [],
    ],
});

exports.index = (req, res) => {
    res.render('snark', { content: "snark page" });
}

var test = (req, res) => {
    testDBFunction();
    var result = testDll.testlib();
    console.log(result);
}