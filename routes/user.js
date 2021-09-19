const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

router.get('/register', forwardAuthenticated, (req, res) => 
  res.render('register', { user: req.user })
);   

router.post('/register', (req, res) => {
  let errors = [];
  const { name, first, last, email, password } = req.body;
  if (!name || !first || !last || !email || !password) {
    errors.push({ msg: 'Please fill out all fields' });
  }
  if (errors.length) {
    res.render('register', { 
      errors, name, first, last, email, password, user: req.user
    });
  } else {
    User.findOne({ email: { "$regex": "^" + email + "\\b", "$options": "i" }})
    .then(user => {
      if (user) {
        errors.push({ msg: 'Email is in database.' });
        res.render('register', { 
          errors, name, first, last, email, password, user: req.user
        });
      } else {
        const newUser = new User({ name, first, last, email, password });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })(req, res, next);
});

module.exports = router;