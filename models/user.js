const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Profile = require('../models/profile');

const userSchema = new mongoose.Schema({})

userSchema.plugin(passportLocalMongoose);

userSchema.post('save', async function (profile) {
    const newProfile = new Profile({ email: this.username, image: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg' })
    newProfile.user = this._id
    await newProfile.save()
})

module.exports = mongoose.model('User', userSchema);