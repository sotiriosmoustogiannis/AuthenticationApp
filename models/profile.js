const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    name: String,
    bio: String,
    phone: Number,
    image: String,
    password: String,
    email: String,
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})


module.exports = mongoose.model('Profile', profileSchema);