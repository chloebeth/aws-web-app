const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const db = require('./config/keys').mongoURI;
require('./controllers/user')(passport);

const port = process.env.port || 80;
const app = express();

app.use(session({ secret: 'cloud', 
				  resave: true,
				  saveUninitialized: true }));

mongoose.connect(db, { useNewUrlParser: true, 
					   useUnifiedTopology: true })
  .then(() => console.log('Mongoose connected...'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index.js'));
app.use('/account', require('./routes/user.js'));

app.listen(port, function () {
	console.log('Server running on ' + port)
});
