/**
 * 
 * adding the functionality we need with these packages
 * 
 * connect flash to see those messages error pops up
 * session to make users de/serialize when needed
 * cookie parser helps us keep track of user's action; each time user loads the site cookie is sent with request.
 * exprss-validator - github page 
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const keys = require('./config/keys');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const userRoutes = require('./routes/userRoutes');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.connect(keys.mongodb.dbURI, () => {
    console.log(`~~Connected live on mLab~~`);
});
require('./config/passport');// it will run through the file while fetching the configurations about passport setup as well.

app.set ('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated(); // this is like creating Glodbal variables
    res.locals.session = req.session;
    next();
})

app.use('/', routes);
app.use('/users', userRoutes);
//app.use('/users', userRoutes);

module.exports = app;