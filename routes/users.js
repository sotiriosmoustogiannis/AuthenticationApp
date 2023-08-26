const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')
const Profile = require('../models/profile')



router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const profile = await Profile.findOne({ user: id })
    if (!profile) {
        req.flash('error', 'Cannot find that profile!');
        return res.redirect('/login');
    }
    res.render('users/details', { profile })
}))

router.get('/:id/try', isLoggedIn, catchAsync(async (req, res) => {
    res.send('users/details')
}))

module.exports = router;