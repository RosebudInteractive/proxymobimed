'use strict';
const path = require('path');
const config = require('config');
const http = require('http');
const express = require('express');
const app = express();

const HTTP_PORT = 5555;

const WEBPACK_PROD = process.env.WEBPACK && process.env.WEBPACK === "prod";

if (!WEBPACK_PROD) {
    let webpack = require('webpack')
    let webpackDevMiddleware = require('webpack-dev-middleware');
    let webpackHotMiddleware = require('webpack-hot-middleware');
    let webpackConfig = require('./webpack.config');

    let compiler = webpack(webpackConfig);
    try {
        app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
        app.use(webpackHotMiddleware(compiler));
    }
    catch (e) {
        console.log(e)
    }
}


let httpPort = config.has('httpPort') ? config.get('httpPort') : HTTP_PORT;
require('./api')(app);

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index.html', { url: config.calypsoUrl });
});

app.get('/iframe', function (req, res) {
    res.render('iframe.html', {});
});

app.use("/public", express.static(__dirname + '/public'));
app.use("/css", express.static(__dirname + '/css'));

http.createServer(app).listen(httpPort, '127.0.0.1');
console.log('Web server started http://127.0.0.1:' + httpPort);
