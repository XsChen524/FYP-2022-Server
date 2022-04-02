var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require("body-parser");
const mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var authController = require('./controllers/auth/AuthController');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var snarkRouter = require('./routes/snark');
var adminRouter = require('./routes/admin');

var app = express();

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'a05402292fff73df',
        database: 'fyp-database'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'ejs');
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* MySQL Connection */
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'a05402292fff73df',
    database: "fyp-database",
    multipleStatements: true
});
connection.connect((err) => {
    if (!err) {
        console.log("Connected");
    } else {
        console.log("Conection Failed");
    }
});
const customFields = {
    usernameField: 'uname',
    passwordField: 'pw',
};

/*Passport JS*/
const verifyCallback = (username, password, done) => {
    connection.query('SELECT * FROM users WHERE username = ? ', [username], function(error, results, fields) {
        if (error)
            return done(error);

        if (results.length == 0) {
            return done(null, false);
        }
        const isValid = authController.validPassword(password, results[0].hash, results[0].salt);
        user = { id: results[0].id, username: results[0].username, hash: results[0].hash, salt: results[0].salt };
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user.id)
});
passport.deserializeUser(function(userId, done) {
    connection.query('SELECT * FROM users where id = ?', [userId], function(error, results) {
        done(null, results[0]);
    });
});

/*Auth middleware*/
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/notAuthorized');
    }
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    } else {
        res.redirect('/notAuthorizedAdmin');
    }
}

function userExists(req, res, next) {
    connection.query('Select * from users where username=? ', [req.body.uname], function(error, results, fields) {
        if (error) {
            console.log("Error");
        } else if (results.length > 0) {
            res.redirect('/userAlreadyExists')
        } else {
            next();
        }
    });
}

//Print session in console
app.use((req, res, next) => {
    res.locals.user = null;
    if (req.user != undefined) {
        console.log(req.user);
        res.locals.user = req.user;
    }
    next();
});

app.use('/admin', adminRouter);
app.use('/', indexRouter);

/* Auth routers */
app.get('/login', (req, res, next) => {
    res.render('auth/login')
});
app.get('/logout', (req, res, next) => {
    req.logout(); //delets the user from the session
    res.redirect('/');
});
app.get('/login-success', (req, res, next) => {
    res.redirect('/');
});
app.get('/login-failure', (req, res, next) => {
    res.redirect('/login');
});
app.get('/register', (req, res, next) => {
    res.render('auth/register')
});
app.post('/register', userExists, (req, res, next) => {
    const saltHash = authController.genPassword(req.body.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    connection.query('Insert into users(username,hash,salt,isAdmin) values(?,?,?,0) ', [req.body.uname, hash, salt], function(error, results, fields) {
        if (error) {
            console.log("Error");
        } else {
            console.log("Successfully Entered");
        }
    });
    res.redirect('/login');
});
app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));
app.get('/protected-route', isAuth, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});
app.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');
});
app.get('/notAuthorized', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource </h1><p><a href="/login">Retry Login</a></p>');
});
app.get('/notAuthorizedAdmin', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource as you are not the admin of the page  </h1><p><a href="/login">Retry to Login as admin</a></p>');
});
app.get('/userAlreadyExists', (req, res, next) => {
    res.send('<h1>Sorry This username is taken </h1><p><a href="/register">Register with different username</a></p>');
});

/* Protected routes */
app.use('/users', isAuth, usersRouter);
app.use('/snark', isAuth, snarkRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;