let webpack = require('webpack');
// require("babel-polyfill");
let path = require('path');

const WEBPACK_ENABLED = process.env.WEBPACK && process.env.WEBPACK === "enabled";

const _prodConfig = {
    // watch: true,
    entry: {
        // "babel-polyfill": "babel-polyfill",
        'main': './src/main',
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
    },
};

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const _devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        // 'babel-polyfill': 'babel-polyfill',
        'webpack-hot-middleware/client': 'webpack-hot-middleware/client',
        main: ['./src/main', hotMiddlewareScript],
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = WEBPACK_ENABLED ? _devConfig : _prodConfig;

