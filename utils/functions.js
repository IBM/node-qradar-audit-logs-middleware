/**
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 */
'use strict';

var os = require('os');

module.exports = {
    fixLength: fixLength,
    getHostIP: getHostIP,
    getEventName: getEventName
};

function increasingLengthComparator(firstObject, secondObject) {
    return firstObject.keyObjectLength - secondObject.keyObjectLength;
}

function fixLength(result, limit) {
    var resultLengths = [];

    for (var key in result) {
        
        if (typeof result[key] !== 'undefined') {
            // each param will have its key, value, a colon and 
            // comma separating values in the output log message.
            var EXTRA_CHARS_PER_KEY_VALUE_PAIR = 2;
            var keyObjectLength = JSON.stringify(key).length +
                JSON.stringify(result[key]).length + EXTRA_CHARS_PER_KEY_VALUE_PAIR;
            var keyObject = {
                'key': key,
                'keyObjectLength': keyObjectLength
            };
            resultLengths.push(keyObject);
        }
    }

    resultLengths.sort(increasingLengthComparator);

    var currentTotalLength = JSON.stringify(result).length;

    while (currentTotalLength > limit && resultLengths.length) {
        var greatestKeyObject = resultLengths.pop();
        delete result[greatestKeyObject.key];
        currentTotalLength = JSON.stringify(result).length;
    }
    return result;
}

function getHostIP() {
    var interfaces = os.networkInterfaces();
    var addresses = {};
    Object.keys(interfaces).forEach(function(interfaceName) {
        interfaces[interfaceName].forEach(function(itf) {
            if (itf.internal || itf.family !== 'IPv4') {
                return;
            }
            addresses[interfaceName] = itf.address; 
        });
    });
    // get the IP from the first network interface we found that’s IPv4 and not internal
    return addresses[Object.keys(addresses)[0]] || 'no external IPv4 network interface found';
}

function getEventName(statusCode) {

    var PERMITTED_STATUS_CODE_RANGE_START = 200;
    var PERMITTED_STATUS_CODE_RANGE_END = 300;
    var DENIED_STATUS_CODE_RANGE_START = 400;
    var DENIED_STATUS_CODE_RANGE_END = 500;

    if (!statusCode) {
        return 'Unknown';
    }

    if (statusCode >= PERMITTED_STATUS_CODE_RANGE_START && statusCode < PERMITTED_STATUS_CODE_RANGE_END) {
        return 'Access Permitted';
    } else if (statusCode >= DENIED_STATUS_CODE_RANGE_START && statusCode < DENIED_STATUS_CODE_RANGE_END) {
        return 'Access Denied';
    } else {
        return 'Unknown';
    }

}