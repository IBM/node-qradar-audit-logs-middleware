# node-audit-logs-middleware
Middleware to log all requests that pass through and aspects of the response.


## Pre-requisites
- Your app must use express as the framework.

## To use
```
npm install git+https://github.ibm.com/hermanba/node-audit-logs-middleware#v0.0.2 --save
var auditLogMiddleware = require('node-audit-logs-middleware);
// init express etc
// add this middleware at the appropriate point (after auth but before the middleware that handles the important routes):
app.use(auditLogMiddleware(log4js.getLogger('audit-logs'));
```


## For ideal use
- Ensure that the fetch-auth middleware is used before this, and that it tacks on the TIAM userinfo object at req.user 

## Recommended logging library
We use this library in conjunction with log4js, so using node-log4js is recommended.

