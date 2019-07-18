/**
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016. 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 */
'use strict';

var log4js = require('log4js');

var logger = log4js.getLogger('audit-lib'),
    logBasePath = 'index',
    utilFunctions = require('./utils/functions');

logger.level = 'info';

module.exports = auditRequest;

function auditRequest(auditLogger) {
    var logPrefix = '[' + logBasePath + '.auditRequest] ';
    return function (req, res, next) {
        var start = new Date(),
            logFn = auditLogger.info,
            writeHead = res.writeHead,
            end = res.end;

        logger.debug(logPrefix + 'Configuring audit log middleware');

        // proxy for statusCode.
        res.writeHead = function(code, reasonPhrase, headers){
            logger.debug(logPrefix + 'res.writeHead received with', code, reasonPhrase, headers);

            res.writeHead = writeHead;
            res.writeHead(code, reasonPhrase, headers);
            res.__statusCode = code;
            res.__headers = headers || {};
        };

        // proxy end to output a line to the provided logger.
        res.end = function(chunk, encoding) {
            logger.debug(logPrefix + 'res.end received');
            res.end = end;
            res.end(chunk, encoding);
            res.responseTime = new Date() - start;
            var loggedMessage = getLogMessage(req, res);

            logger.debug(logPrefix + 'Audit log message: ', loggedMessage);
            logFn.call(auditLogger, loggedMessage);
        };

        logger.debug(logPrefix + 'Moving on to next middleware');
        next();
    };
}

/**
 * Return formatted log line.
 */
function getLogMessage(req, res) {
    var statusCode = res.__statusCode || res.statusCode;

    var eventName = utilFunctions.getEventName(statusCode);

    var source;
    if (req.get('X-Client-IP')) {
        source = req.get('X-Client-IP').split(',')[0];
    } else if (req.get('x-forwarded-for')) {
        source = req.get('x-forwarded-for').split(',')[0];
    } else {
        source = req.socket && 
            (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress));
    }

    // see https://github.com/IBM/node-qradar-audit-logs-middleware/issues/5
    var TCP_LIMIT_LENGTH = 3900;
    var UDP_LIMIT_LENGTH = 850;
    var limit = TCP_LIMIT_LENGTH; 
    if (process.env.log4js_syslog_appender_useUdpSyslog === 'true') {
        limit = UDP_LIMIT_LENGTH;
    }

    var result = {
        event: eventName,
        oper: req.method,
        res: req.originalUrl,
        usrName: req.user && req.user.user_name || req.user && req.user.iam_id,
        transactionId: req.transactionId || req.headers['transaction-id'],
        dst: utilFunctions.getHostIP(),
        src: source,
        response_code: statusCode,
        response_time: res.responseTime + ' ms',
        timestamp: '' + new Date().getTime(),
        referrer: req.headers.referer || req.headers.referrer || '',
        http_version: req.httpVersionMajor + '.' + req.httpVersionMinor,
        user_agent: req.headers['user-agent'] || '',
        content_length:  '' + ((res._headers && res._headers['content-length']) || 
            (res.__headers && res.__headers['Content-Length']) || '-'),
        req_body: req.body
    };

    result = utilFunctions.fixLength(result, limit);

    return JSON.stringify(result);
}