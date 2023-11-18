require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Movie = require('./models/movie.js');
const methodOverride = require('method-override');
const MONGOURI = process.env.MONGOURI
const movieRoutes = require('./controller/movieRoutes.js');


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use('/movies', movieRoutes);
app.use(express.static("public"));


// Connect to MongoDB
mongoose.connect(MONGOURI + 'filmfanatics');
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo')
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});