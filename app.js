const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')
const authRoutes = require('./routes/authRoutes')
const cP = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cP());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.DB_CONNECTION;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.use(authRoutes)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.get('/set-cookies', (req, res) => {

    // res.setHeader('Set-Cookie', 'newUser=true')
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, {
        maxAge: 1000 * 60 * 60 * 24,
        // secure: true,
        httpOnly: true
    });

    res.send('Hello')
})
app.get('/read-cookies', (req, res) => {

    const cookies = req.cookies;

    console.log(typeof(cookies.newUser))

    res.json(cookies)
})