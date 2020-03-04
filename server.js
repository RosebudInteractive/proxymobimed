'use strict';
const path = require('path');
const config = require('config');
const http = require('http');
const express = require('express');
const app = express();

const HTTP_PORT = 5555;

let httpPort = config.has('httpPort') ? config.get('httpPort') : HTTP_PORT;
require('./api')(app);

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index.html', { url: config.calypsoUrl });
});

app.get('/iframe', function (req, res) {
    res.render('iframe.html', {});
});

app.use("/src", express.static(__dirname + '/src'));
app.use("/css", express.static(__dirname + '/css'));
// app.use("/public", express.static(__dirname + '/public'));

http.createServer(app).listen(httpPort, '127.0.0.1');
console.log('Web server started http://127.0.0.1:' + httpPort);
