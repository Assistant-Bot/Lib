const app = require('express')();
const http = require('http').Server(app);
const ports = { standard: 80, secure: 443 };
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Loader = require('./Classes/Loader.js');
const Auth = require('./Classes/Auth.js');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const DiscordAuth = Auth({
    clientId: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    tokenCheck: true,
    domain: 'discord',
    rateLimit: 0, // limit to 0 milli-seconds for fetching token.	
    onError: '/',
    onComplete: '/dashboard',
    listen: '/login', // URL to listen for	
    name: 'assistant', // set for cookie	
    expires: 24 * 10 // 24 hours times 10 days = 2,400 hours	
});

app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(__dirname + '/Pages'));
app.use(session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379
    }),
    secret: secret,
    resave: false,
    cookie: { maxAge: 604800000 },
    saveUninitialized: false
}));

app.use(DiscordAuth.express);

let cache = [];
Loader(__dirname + '/MiddleWare', async (f) => {
    if (!f.execution) return console.error('Invalid exectution provided for: ' + f.name);
    if (!f.settings.priority || f.settings.priority === null) return cache.push(f);
    return app.use(f.execution);
});

cache.forEach(f => app.use(f.execution)); // load second hand files.	

Loader(__dirname + '/routes', async (f) => {
    if (!f.settings.type) app.get(f.settings.url, f.route);
    else {
        if (f.settings.type === 'post') {
            app.post(f.settings.url, f.route);
        }
        if (f.settings.type === 'delete') {
            app.delete(f.settings.url, f.route);
        }
        if (f.settings.type === 'patch') {
            app.patch(f.settings.url, f.route);
        }
        if (f.settings.type === 'get') {
            app.get(f.settings.url, f.route);
        }
    }
});

http.listen(ports.standard, async () => {
    console.log(`Site signed in on port ${ports.standard}`)
});
http.listen(ports.secure, async () => {
    console.log(`Site signed in on port ${ports.secure}`)
});