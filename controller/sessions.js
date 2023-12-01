const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users')
const Movie = require('../models/movie')

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs',)
})

sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if(err) {
            console.log(err)
            res.send('oops, you hit an error')
        } else if (!foundUser) {
            res.send('<a href="/">Sorry, no user found</a>')
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
               req.session.currentUser = foundUser
               console.log(req.session.currentUser)
               Movie.find({}, (error, movies) => {
                if (error) {
                  return res.status(500).json({ error: error.message });
                }
               res.render('index.ejs', {movies: movies, currentUser: req.session.currentUser})
               })
            } else {
                res.send('<a href="/sessions/new">Password does not match </a>')
            }
        }
    })
})

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/movies')
    })
})

module.exports = sessions