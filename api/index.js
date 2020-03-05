'use strict';
const fs = require('fs');
const config = require('config');
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const USERS = {
    "u1": { Id: 1, Password: 'p1' },
    "u2": { Id: 2, Password: 'p2' },
    "u3": { Id: 3, Password: 'p3' }
};

const DFLT_CALYPSO_URL = "http://localhost:3333";
const CALYPSO_AUTH_URL = `${config.has('calypsoUrl') ? config.get('calypsoUrl') : DFLT_CALYPSO_URL}/api/mobimed-auth`;
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.pem', 'utf8');  // get public key

const COOKIE_NAME = "mobimed.user";
const COOKIE_OPTIONS = {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true
};

module.exports = (app) => {

    let calypsoUrl = config.has('calypsoUrl') ? config.get('calypsoUrl') : DFLT_CALYPSO_URL;
    app.use(cookieParser());
    app.use("/api", bodyParser.json({ limit: '128mb' }));
    app.use("/api", bodyParser.urlencoded({ extended: true }));

    app.get("/api/options", (req, res) => {
        res.json({ calypsoUrl: calypsoUrl });
    });

    app.get("/api/whoami", (req, res) => {
        try {
            let cuser = req.cookies[COOKIE_NAME];
            if (USERS[cuser]) {
                res.json({ login: cuser, userId: USERS[cuser].Id });
            }
            else
                res.status(401).json({ message: 'Invalid or missing user.' });
        }
        catch (err) {
            res.status(500).json({ message: err && err.message ? err.message : `Unknown error.` });
        }
    });

    app.get("/api/logout", (req, res) => {
        res.clearCookie(COOKIE_NAME);
        res.json({ result: "OK" });
    });

    app.post("/api/login", (req, res) => {
        res.clearCookie(COOKIE_NAME);
        if (USERS[req.body.login] && USERS[req.body.login].Password === req.body.password) {
            try {
                let user = { login: req.body.login, userId: USERS[req.body.login].Id };
                res.cookie(COOKIE_NAME, req.body.login, COOKIE_OPTIONS);
                res.json(user);
            }
            catch (err) {
                res.status(500).json({ message: err && err.message ? err.message : `Unknown error.` });
            }
        }
        else
            res.status(401).json({ message: 'Invalid user name or password.' });
    });

    app.get("/api/calypso-token", (req, res) => {
        let cuser = req.cookies[COOKIE_NAME];
        if (USERS[cuser]) {
            try {
                let user = { login: cuser, userId: USERS[cuser].Id };
                let token = jwt.sign({ user: user }, privateKey, { algorithm: 'RS256', expiresIn: 10 });
                request.post(
                    {
                        url: CALYPSO_AUTH_URL,
                        body: { token: token },
                        json: true
                    }, (error, response, body) => {
                        try {
                            if (error)
                                throw error;
                            else
                                switch (response.statusCode) {
                                    case 200:
                                        body.calypsoUrl = calypsoUrl;
                                        res.json(body);
                                        break;
                                    default:
                                        res.status(response.statusCode)
                                            .json({ message: body && body.message ? body.message : `Unknown error.` });
                                };
                        }
                        catch (err) {
                            res.status(500).json({ message: err && err.message ? err.message : `Unknown error.` });
                        }
                    });
            }
            catch (err) {
                res.status(500).json({ message: err && err.message ? err.message : `Unknown error.` });
            }
        }
        else
            res.status(401).json({ message: 'Invalid or missing user.' });
    });
}