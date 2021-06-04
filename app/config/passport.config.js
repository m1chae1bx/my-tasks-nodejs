var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const db = require("../models");
const User = db.users;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, {message: 'User not found', code: 'user'});
        }
        if(!user.validPassword(password)) {
          return done(null, false, {message: 'Password is incorrect', code: 'pass'});
        }
        return done(null, user);
      });
    }
  )
)