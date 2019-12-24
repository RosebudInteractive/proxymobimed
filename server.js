'use strict';
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();

const HTTP_PORT = 5555;

require('./api')(app);

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});

http.createServer(app).listen(HTTP_PORT, '0.0.0.0');
console.log('Web server started http://127.0.0.1:' + HTTP_PORT);
