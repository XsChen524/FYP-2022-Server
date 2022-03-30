var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

var router = express.Router();

/*Passport JS*/
const verifyCallback = (username, password, done) => {

    connection.query('SELECT * FROM users WHERE username = ? ', [username], function(error, results, fields) {
        if (error)
            return done(error);

        if (results.length == 0) {
            return done(null, false);
        }
        const isValid = validPassword(password, results[0].hash, results[0].salt);
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
    console.log("inside serialize");
    done(null, user.id)
});

passport.deserializeUser(function(userId, done) {
    console.log('deserializeUser' + userId);
    connection.query('SELECT * FROM users where id = ?', [userId], function(error, results) {
        done(null, results[0]);
    });
});


/*middleware*/
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return { salt: salt, hash: genhash };
}


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

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/logout', (req, res, next) => {
    req.logout(); //delets the user from the session
    res.redirect('/protected-route');
});
router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

router.get('/register', (req, res, next) => {
    console.log("Inside get");
    res.render('register')

});

router.post('/register', userExists, (req, res, next) => {
    console.log("Inside post");
    console.log(req.body.pw);
    const saltHash = genPassword(req.body.pw);
    console.log(saltHash);
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

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login-failure',
        successRedirect: '/login-success'
    })
);

router.get('/protected-route', isAuth, (req, res, next) => {

    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

router.get('/admin-route', isAdmin, (req, res, next) => {

    res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');

});

router.get('/notAuthorized', (req, res, next) => {
    console.log("Inside get");
    res.send('<h1>You are not authorized to view the resource </h1><p><a href="/login">Retry Login</a></p>');

});
router.get('/notAuthorizedAdmin', (req, res, next) => {
    console.log("Inside get");
    res.send('<h1>You are not authorized to view the resource as you are not the admin of the page  </h1><p><a href="/login">Retry to Login as admin</a></p>');

});
router.get('/userAlreadyExists', (req, res, next) => {
    console.log("Inside get");
    res.send('<h1>Sorry This username is taken </h1><p><a href="/register">Register with different username</a></p>');

});


module.exports = router;