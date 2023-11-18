const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  comment: String,
  // Add more fields as needed
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
