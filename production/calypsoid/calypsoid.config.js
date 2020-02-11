'use strict';

let apps = [{
    name: 'Proxy-Mobimed',
    script: './server.js',
    cwd: '/var/www/calypso/proxy-mobimed',
    env: {
        NODE_ENV: 'development',
        NODE_CONFIG_ENV: 'calypsoid',
    }
}];

module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: apps
};
