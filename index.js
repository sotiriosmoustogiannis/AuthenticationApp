const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.listen(8080, () => {
    console.log("App is listening to 8080 port");
})

app.get('/', (req, res) => {
    res.render('home');
})

app.get('*', (req, res) => {
    res.send("There is no such a path");
})