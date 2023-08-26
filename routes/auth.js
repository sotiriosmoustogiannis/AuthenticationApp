const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware')
const User = require('../models/user');
const Profile = require('../models/profile');


router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//Register
router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', catchAsync(async (req, res) => {
    const { username, password } = req.body
    const user = new User({ username })
    const registeredUser = await User.register(user, password)
    // login if a user registers
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Details!');
        res.redirect(`/users/${registeredUser._id}`);
    })
    //res.redirect('/details') we have to redirect here when it is ready
}))

//Login
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const id = req.user._id
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || `/users/${id}`;
    res.redirect(redirectUrl);
})

//Logout
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
})

module.exports = router;