const bcrypt = require("bcrypt");
const express = require("express");
const sessions = express.Router();
const User = require("../models/users");

// Render login form
sessions.get("/new", (req, res) => {
  res.render("sessions/new.ejs");
});

// Handle login form submission
sessions.post("/", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, foundUser) => {
    console.log("Found User:", foundUser);

    if (err) {
      console.error(err);
      res.status(500).send("Oops, you hit an error");
    } else if (!foundUser) {
      res.send('<a href="/sessions/new">Sorry, no user found</a>');
    } else {
      if (bcrypt.compareSync(password, foundUser.password)) {
        req.session.currentUser = foundUser;
        console.log("User logged in:", foundUser.username);
        res.redirect("/movies"); // Redirect to a different route after successful login
      } else {
        console.log("Password does not match");
        res.send('<a href="/sessions/new">Password does not match </a>');
      }
    }
  });
});

// Handle logout
sessions.delete("/", (req, res) => {
  const currentUser = req.session.currentUser;

  if (currentUser) {
    console.log("User logged out:", currentUser.username);
  }

  req.session.destroy(() => {
    res.redirect("/movies");
  });
});

module.exports = sessions;
