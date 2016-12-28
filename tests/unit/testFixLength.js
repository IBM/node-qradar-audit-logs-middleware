/**
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 */
 'use strict';

var test = require('tape'),
    utilFunctions = require('../../utils/functions');

var exampleResult = require('../fixtures/examplePost.json');

test('Result length under length limit', function(t) {

    var resultDeepCopy = JSON.parse(JSON.stringify(exampleResult));

    var newResult = utilFunctions.fixLength(JSON.parse(JSON.stringify(resultDeepCopy)), 300);

    t.equal(JSON.stringify(newResult), JSON.stringify(resultDeepCopy), 
        'is the json object with length under the limit unchanged?');
    t.end();
});

test('Result length over length limit by a key', function(t) {
    var resultDeepCopy = JSON.parse(JSON.stringify(exampleResult));

    var newResult = utilFunctions.fixLength(JSON.parse(JSON.stringify(resultDeepCopy)), 200);
    delete resultDeepCopy.req_body;

    t.equal(JSON.stringify(newResult), JSON.stringify(resultDeepCopy), 
        'did the json object with length over the limit get the longest key-value removed?');
    t.end();
});

test('Result length over length limit by two keys', function(t) {
    var resultDeepCopy = JSON.parse(JSON.stringify(exampleResult));

    var newResult = utilFunctions.fixLength(JSON.parse(JSON.stringify(resultDeepCopy)), 50);
    delete resultDeepCopy.req_body;
    delete resultDeepCopy.usrName;

    t.equal(JSON.stringify(newResult), JSON.stringify(resultDeepCopy), 
        'did the json object with length over the limit get the longest key-value removed?');
    t.end();
});