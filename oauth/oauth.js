//  require these
const passport = require('passport');
const GoogleOauth = require('passport-google-oauth2');
const User = require("../models/user");


// store these credientials in the .env file, by the way you can get these credentiels from google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


passport.use(new GoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
}, // if the credientials are correct: google strategy will give you a payload( we called it profile) that contains the profile details in the next callback which will execute.
function(request, accessToken, refreshToken, profile, done) {
     // the first param of done is the error, but since we don't have error here we wrote null
     return User.findOne({ where: { id: profile.id } })
     .then((user) => {
       // the first param of done is the error, but since we don't have error here we wrote null
       return done(null, user);
     })
     .catch((err) => {
       return done(err);
     });
}));



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



//for the protected route add this: 

app.get('/auth/google',             // the scope specify what info we wanna retrieve
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));
// and that will redirect you to google



// if everything goes ok, google will redirect you to the redirectUrl you specified in the strategy


app.get( '/redirectUrl',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });



// the login middleware:
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }


app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
  });



// you know you will need the init stuff:

const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



// review thee local strategy for more details