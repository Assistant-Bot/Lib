/**	
 * options.clientId - Client ID	
 * options.clientSecret - Client Secret	
 * options.callbackURL - Call back url to listen to.	
 * options.scopes - Array of scopes	
 * options.mode - String	
 * options.url - URL to listen for.	
 * Discord Auth uses cookies rather than session storage.	
 */
const fetchURL = require('../Util/fetch.js');
const btoa = require('btoa');
function Auth(options) {
    if (!options.clientId) throw 'You must provide a clientId';
    if (!options.clientSecret) throw 'You must provide a clientSecret';
    if (!options.callbackURL) options.callbackURL = '/callback';
    if (!options.scopes) options.scopes = ['identify', 'guilds'];
    if (!options.domain) options.domain = 'discord';
    if (!options.url) options.url = '/login';
    if (!options.expires) options.expires = 10;
    if (!options.redirect) options.redirect = '/discordauthorize/';
    if (!options.callback) options.callback = '/callback';
    if (!options.tokenCheck) options.tokenCheck = true;
    if (!options.onComplete) options.onComplete = '/complete';

    this.domain = getDOMAIN(options.domain);
    this.listen = options.listen;
    this.options = options;
    this.limited = new Set();
    this.express = async function (req, res, next) {
        let type = req.path;
        try {
            if (this.options.redirect + 'undefined' == type) res.redirect('/error/?msg=You are being ratelimited :(');
            if (this.options.tokenCheck === true) {
                let data = await this.checkToken(req, false);
                if (data !== false) req = data;
                req.logout = function () {
                    req.session.discord = undefined;
                    res.cookie(`${options.name}.id`, 'no', { maxAge: 100 });
                    res.cookie(`${options.name}.rid`, 'no', { maxAge: 100 });
                };
            }
            req.checkAuthorized = this.checkToken;

            if (type === this.options.redirect) this.authorize(req, res, next);
            else if (type === this.options.callback) this.callBack(req, res, next);
            else if (!this.listen) next();
            else if (typeof this.listen == 'string' && type !== this.listen) next();
            else if (typeof this.listen == 'object' && this.listen.includes(type)) next();
            else this.redirect(res);
        } catch (e) {
            return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);
        }
    };

    this.callBack = async function (req, res, next) {
        try {
            let code = req.query.code;
            let type = req.path;
            if (!code) {
                return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);
            }
            if (this.domain.search('discord') == -1) return next();

            let redirect = encodeURIComponent(this.options.callbackURL);
            let url = `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`;
            const creds = btoa(`${this.options.clientId}:${this.options.clientSecret}`);
            const response = await fetchURL(url, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${creds}`,
                },
            });
            const json = response;
            return res.redirect(`${this.options.redirect}?token=${json.access_token}&refresh=${json.refresh_token}`);
        } catch (e) {
            return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);
        }
    };

    this.redirect = function (res) {
        let url = this.domain;
        url = url.replace('{CALLBACK}', this.options.callbackURL);
        url = url.replace('{CLIENT_ID}', this.options.clientId);
        url = url.replace('{SCOPES}', this.options.scopes.join(' '));
        return res.redirect(url);
    };

    this.authorize = async function (req, res, next) {
        try {
            const token = req.query.token;
            if (token == undefined)
                return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);
            if (token == 'undefined')
                return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);

            res.cookie(`${this.options.name}.id`, token, { maxAge: (1000 * 60 * 60) * this.options.expires });
            res.cookie(`${this.options.name}.rid`, req.query.refresh, { maxAge: (1000 * 60 * 60) * this.options.expires });
            return res.redirect(this.options.onComplete);
        } catch (e) {
            return (typeof this.options.onError == 'function') ? this.options.onError(req, res, next) : res.redirect(this.onError);
        }
    };


    /**	
    * @deprecated checkToken(req) - No longer checks discord, and checks session instead.	
    * @var fetch - Fetch discord?	
    */

    this.checkToken = async function (req, fetch) {
        try {
            if (fetch == undefined) fetch = false;
            let tk_cookie = this.options.name + '.id';
            let n = this.options.name + '.rid';
            let token = req.cookies[tk_cookie];

            if (!req.cookies[tk_cookie]) return false;
            if (req.session === undefined) throw 'PLEASE INSTALL express-session';
            if (!req.session.discord) {
                req.session.discord = {};
                req.session.discord[n] = req.cookies[n];
                req.session.discord[tk_cookie] = token;
            }
            if (!req.session.discord[tk_cookie]) req.session.discord[tk_cookie] = req.cookies[tk_cookie];
            if (fetch == false) {
                req.user = (req.session.discord.user == undefined) ? await this.get('users/@me', token) : req.session.discord.user;
                req.user.guilds = (!req.user.guilds && !req.session.discord.user) ? await this.get('users/@me/guilds', token) : req.session.discord.user.guilds;
                // Do another check	
                if (req.user === undefined || req.user === false) return false; // Not authorized.	
                if (req.user.guilds === undefined || req.user === false) return false; // Guilds not found.	

                // Set the properties to discord user in session (Prevents multiple fetches unless asked by the client.)	
                req.session.discord.user = req.user;
                req.session.discord.user.guilds = req.user.guilds;
                return req;
            } else {
                /* forcefully set new data */
                req.user = await this.get('users/@me', token);
                req.user.guilds = await this.get('users/@me/guilds', token);

                if (req.user === undefined || req.user === false) return false; // Not authorized.	
                if (req.user.guilds === undefined || req.user === false) return false; // Guilds not found.	
                req.session.discord.user = req.user;
                req.session.discord.user.guilds = req.user.guilds;
                return req;
            }
        } catch (e) {
            console.log(e.message);
            return false;
        }
    };

    this.get = async function (url, auth) {
        let opts = {
            headers: { 'Authorization': `Bearer ${auth}` },
            method: 'GET'
        };
        let data = await fetchURL(`https://discordapp.com/api/${url}`, opts);
        if (!data || data === false) return false;
        if (data.message) return false;
        return data;
    }

    return this;

    /**	
    * @var discord - Useful functions stored in cache	
    */

}
module.exports = Auth;

function getDOMAIN(t) {
    if (t.toLowerCase() === 'discord')
        return 'https://discordapp.com/api/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={CALLBACK}&response_type=code&scope={SCOPES}';
    else return t;
} 