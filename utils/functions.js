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

function increasingLengthComparator(a, b) {
    return a.keyObjectLength - b.keyObjectLength;
};

function fixLength(result, limit) {
    var resultLengths = [];

    for (var key in result) {
        // each param will have its key, value, a space char, a colon and 
        // comma separating values in the output log message.
        var keyObjectLength = JSON.stringify(key).length + JSON.stringify(result[key]).length + 3;
        var keyObject = {
            'key': key,
            'keyObjectLength': keyObjectLength
        }
        resultLengths.push(keyObject);
    }

    resultLengths.sort(increasingLengthComparator);

    var currentTotalLength = JSON.stringify(result).length;

    while (currentTotalLength > limit) {
        var greatestKeyObject = resultLengths.pop();
        delete result[greatestKeyObject.key];
        currentTotalLength = JSON.stringify(result).length;
    }

    return result
};

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
    hostIP = addresses[Object.keys(addresses)[0]] || 'no external IPv4 network interface found';
    return hostIP;
};

function getEventName(statusCode) {

    if (!statusCode) {
        return "Unknown";
    }

    if (statusCode >= 200 && statusCode < 300) {
        return "Access Permitted";
    }
    else if (statusCode >=400 && statusCode < 500) {
        return "Access Denied";
    }
    else {
        return "Unknown";
    }

};