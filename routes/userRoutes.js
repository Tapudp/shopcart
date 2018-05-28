const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {title: "Divyesh"});
});

router.get('/userhome', isLoggedIn, (req, res, next) => {
    res.status(201)
        .render('userHome', { title: 'Feed' });
});

router.use('/', notLoggedIn, (req, res, next) => { // a new thing learned here to put in routes manouver them
    next();
}); 

router.get('/signup', (req, res) => {
    var messages = req.flash('error');
    res.render('signup', { title: 'Signup to Cart', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', (req, res) => {
    //var messages = req.flash('error');
    res.render('signin', { title: 'signin to Cart',/* messages: messages, hasErrors: messages.length > 0 */});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/logout', (req, res, next) => {
    req.logout(); // passport method
    res.redirect('/');
})



module.exports = router;

// if I use an arrow function it is not going to recognise the isLoggedIn function
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){ // isAuthenticated() is a passport function
        return next();
    }
    res.redirect('/');
};

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};