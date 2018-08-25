const server = require('./src/server');
const router = require('./src/router');
const requestHandlers = require('./src/requestHandlers');

let handle = {};

handle['/'] =  requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle['/localFiles'] = requestHandlers.localFiles;
handle['/localFile'] = requestHandlers.localFile;

server.start(router.route, handle)