require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Movie = require('./models/movie.js');
const methodOverride = require('method-override');
const MONGOURI = process.env.MONGOURI
const movieRoutes = require('./controller/movieRoutes.js');
const userController = require('./controller/users.js')
const sessionsController = require('./controller/sessions.js')
const session = require('express-session')
const MongoStore = require('connect-mongo');


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGOURI
  }),
}))
app.use('/sessions', sessionsController)
app.use('/movies', movieRoutes);
app.use('/users', userController)
app.use(express.static("public"));



// Connect to MongoDB
mongoose.connect(MONGOURI + 'filmfanatics');
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo')
})

// routes
app.get('/', (req, res) => {
  res.render('home.ejs', {
      currentUser: req.session.currentUser
  })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});