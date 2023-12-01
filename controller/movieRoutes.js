const express = require("express");
const router = express.Router();
const Movie = require("../models/movie.js");

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
      return next();
  } else {
      res.redirect('/sessions/new'); // Redirect to login page if not authenticated
  }
};

// Index route
router.get("/", (req, res) => {
  console.log('currentUser in /movies route:', req.session.currentUser);
  // Fetch movies and pass them to the view
  Movie.find({}, (error, movies) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.render("index.ejs", { movies: movies, currentUser: req.session.currentUser });
    
  });
});

// New route
router.get("/new", isAuthenticated, (req, res) => {
  res.render("new.ejs", {
    currentUser: req.session.currentUser
});
});

// Delete route
router.delete("/:id", isAuthenticated, (req, res) => {
  Movie.findByIdAndRemove(req.params.id, (error, deletedEntity) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!deletedEntity) {
      return res.status(404).json({ message: "Entity not found" });
    }
    res.redirect("/movies");
  });
});

// Update route
router.put("/:id", isAuthenticated, (req, res) => {
  Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, updatedEntity) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!updatedEntity) {
        return res.status(404).json({ message: "Entity not found" });
      }
      res.redirect(`/movies/${updatedEntity._id}`);
    }
  );
});

// Create route
router.post("/", isAuthenticated, (req, res) => {
  const { title, genre, rating, comment, img } = req.body;

  const newMovie = {
    title,
    genre,
    rating,
    comment,
    img,
  };

  Movie.create(newMovie, (error, createdMovie) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Redirect to the show page for the newly created movie
    res.redirect(`/movies/${createdMovie._id}`);
  });
});

// Edit route

router.get("/:id/edit", isAuthenticated, (req, res) => {
  Movie.findById(req.params.id, (error, combinedEntity) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!combinedEntity) {
      return res.status(404).json({ message: "Entity not found" });
    }
    res.render("edit.ejs", {
      movie: combinedEntity,
      currentUser: req.session.currentUser
    });
  });
});

// Show route
router.get("/:id", (req, res) => {
  Movie.findById(req.params.id, (error, combinedEntity) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!combinedEntity) {
      return res.status(404).json({ message: "Entity not found" });
    }

    // Check if the request wants JSON response
    if (req.accepts("html")) {
      // Render HTML if the client accepts HTML
      res.render("show.ejs", { movie: combinedEntity });
    } else {
      // Send JSON response if the client accepts other formats
      res.json({ movie: combinedEntity });
    }
  });
});


module.exports = router;
