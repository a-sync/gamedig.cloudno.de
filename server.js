"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const gamedig_1 = require("gamedig");
const DBG = Boolean(process.env.DBG) || false;
const maxAttempts = parseInt(process.env.MAX_ATTEMPTS, 2) || 1;
const socketTimeout = parseInt(process.env.SOCKET_TIMEOUT, 2) || 2000;
const attemptTimeout = parseInt(process.env.ATTEMPT_TIMEOUT, 2) || 10000;
const givenPortOnly = Boolean(process.env.GIVEN_PORT_ONLY) || false;
const listenUdpPort = parseInt(process.env.LISTEN_UDP_PORT, 2) || undefined;
(0, http_1.createServer)((req, res) => {
    const q = (0, url_1.parse)(req.url, true).query;
    if (DBG)
        console.log('%o', q);
    if (q.type && q.host) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        (0, gamedig_1.query)({
            type: String(q.type),
            host: String(q.host),
            port: parseInt(String(q.port), 2),
            requestRules: Boolean(q.requestRules),
            maxAttempts,
            socketTimeout,
            attemptTimeout,
            givenPortOnly,
            // @ts-ignore
            listenUdpPort
        })
            .then(data => {
            res.end(JSON.stringify(data, null, 2));
        })
            .catch(error => {
            if (DBG)
                console.error('Error: %s', error.message);
            res.end();
        });
    }
    else {
        res.writeHead(301, { 'Location': 'https://github.com/a-sync/gamedig.cloudno.de' });
        res.end();
    }
}).listen(80, '0.0.0.0');