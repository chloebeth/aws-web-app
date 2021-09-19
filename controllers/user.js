const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'name' }, (username, password, done) => {
      User.findOne({
        name: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Your username is not in the database. Please create an account on the registration page.' });
        }
        bcrypt.compare(password, user.password, (err, same) => {
          if (err) throw err;
          if (same) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wrong password.' });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
