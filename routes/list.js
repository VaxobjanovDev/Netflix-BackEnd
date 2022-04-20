const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyJWToken");

// Post

router.post("/", verify, async (req, res) => {
  if (req.user.admin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

// Put

router.put("/:id", verify, async (req, res) => {
  if (req.user.admin) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedList);
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
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("List has been deleted");
    } catch {
      res.status(500).json("Server error");
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

// Get
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    console.log("Be happy");
    res.status(200).json(list);
  } catch (err) {
    console.log("Be happy");
    res.status(500).json(err);
  }
});

module.exports = router;
