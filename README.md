# IBM Bluemix DevOps Services - node-audit-logs-middleware

For more information on IBM Bluemix DevOps Services, see the [Bluemix Public IDS Experiment](https://new-console.ng.bluemix.net/dashboard/devops).

This is one of hundreds of [IBM Open Source projects at GitHub](http://ibm.github.io).

# node-audit-logs-middleware
Middleware to log all requests that pass through and aspects of the response.

## To upgrade 
- `npm uninstall node-audit-logs-middleware  --save`
- `npm install git+https://github.ibm.com/org-ids/node-audit-logs-middleware#v<latestTag> --save`

## Pre-requisites
- Your app must use express as the framework.

## To use
```
npm install git+https://github.ibm.com/org-ids/node-audit-logs-middleware#<latestTag> --save
var auditLogMiddleware = require('node-audit-logs-middleware);
// init express etc
// add this middleware at the appropriate point (after auth but before the middleware that handles the important routes):
app.use(auditLogMiddleware(log4js.getLogger('audit-logs'));
```


## For ideal use
- Ensure that the fetch-auth middleware is used before this, and that it tacks on the TIAM userinfo object at req.user

## Recommended logging library
We use this library in conjunction with log4js, so using node-log4js is recommended.

## License

[The MIT License (MIT)](LICENSE.txt)

## Contributing

Contributions are welcome via Pull Requests. Please submit your very first Pull Request against the [Developer's Certificate of Origin](DCO.txt), adding a line like the following to the end of the file... using your name and email address of course!

```
Signed-off-by: John Doe <john.doe@example.org>
```
