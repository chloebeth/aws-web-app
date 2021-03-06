const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => 
  res.render('index', { user: req.user })
);

router.get('/profile', ensureAuthenticated, (req, res) =>
  res.render('profile', { user: req.user })
);

module.exports = router;