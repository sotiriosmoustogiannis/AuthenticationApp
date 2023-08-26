const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/user');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExpressError = require('./utils/ExpressError');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users.js');


main().catch(err => console.log(err));
async function main() {
    console.log('Successful connected to Database')
    await mongoose.connect('mongodb://127.0.0.1:27017/authDb', { useNewUrlParser: true, useUnifiedTopology: true });

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        //expire session id every one week for security reasons
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));

app.use(passport.initialize());
// careful to define passport.session under the main session (line 55)
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));

// what to do with user session and when user logout
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', authRoutes);
app.use('/users', userRoutes);


//VALIDATE DATA
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = "Oh no something went wrong"
    res.status(statusCode).render('error', { err })
})

app.listen(8000, () => {
    console.log("App is listening to 8000 port");
})