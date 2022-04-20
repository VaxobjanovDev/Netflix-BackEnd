const router = require("express").Router();
const Movie = require("../models/Movies");
const verify = require("../verifyJWToken");

// Post

router.post("/", verify, async (req, res) => {
  if (req.user.admin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

// Update
router.put("/:id", async (req, res) => {
  if (req.user.admin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

// Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.admin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted");
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

// Get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch {
    res.status(500).json("Server error");
  }
});

// Get Random
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All movies

router.get("/", verify, async (req, res) => {
  if (req.user.admin) {
    try {
      const movie = await Movie.find();
      res.status(200).json(movie.reverse());
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

module.exports = router;
