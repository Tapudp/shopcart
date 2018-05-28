
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
//const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

// from https://stackoverflow.com/a/19949584/8578337

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
   
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('email', 'Invalid Email').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    
    if(errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('errors', messages));
    }

    User.findOne({ 'email': email }, (err, user) =>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, { message: 'Email is already in use.' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password); // need to encrypt
        newUser.save((err, result) => {
            if(err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();

    if(errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email })
        .then(currentUser => {
        if(currentUser){
            done(null, currentUser);
            console.log(currentUser);
        }})
        .catch(err => {
            console.log(err);
            done(null, err);
        });

    // User.findOne({'email': email}, (err, user) => {
    //     if(err) {
    //         return done(err);
    //     }
    //     if(!user){
    //         return done(null, false, { message: 'No User found' });
    //     }
    //     if(!user.validPassword(password)){
    //         return done(null, false, { message: 'Wrong password' });
    //     }
    //     return done(null, user);
    // });
    console.log('passport callback has fired!');

}));

// passport.use('google', new GoogleStrategy({
//     // options for the google strategy
//     callbackURL: '/google/redirect',
//     clientID: keys.google.clientID,
//     clientSecret: keys.google.clientSecret
//     }, (accessToken, refreshToken, profile, done) => {
//         // check if user already exists in our db
//         console.log(profile);
//         User.findOne({googleId: profile.id}).then((currentUser) => {
//             if(currentUser){
//                 // already have the user
//                 done(null, currentUser);
//                 console.log('user is: ', currentUser);
//             } else {
//                 // if not create user in our db
//                 new User({
//                     username: profile.displayName,
//                     googleId: profile.id,
//                     thumbnail: profile._json.image.url
//                 }).save().then(newUser => {
//                     console.log('new user created : '+newUser);
//                     done(null, newUser);
//                 });
//             }
//         })
        
//         console.log('passport callback function has fired');
//         console.log(profile);
        
//     })
// );
