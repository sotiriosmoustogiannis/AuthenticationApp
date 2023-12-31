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

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const profile = await Profile.findOne({ user: id })
    if (!profile) {
        req.flash('error', 'Cannot find that profile!');
        return res.redirect(`/users/${id}`);
    }
    res.render('users/edit', { profile })
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const profile = await Profile.findOne({ user: id })
    console.log(req.body)
    const updatedprofile = await Profile.findByIdAndUpdate(profile._id, { ...req.body });
    console.log(updatedprofile)
    req.flash('success', 'Successfully updated details!');
    res.redirect(`/users/${id}`)
}))


module.exports = router;