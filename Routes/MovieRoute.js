const router = require("express").Router();

const {
     getMovies,
     deleteMovie,
     uploadMovie,
     rateMovie,
} = require("../Controllers/MovieController");

router.get("/", getMovies);
router.post("/upload", uploadMovie);
router.delete("/:userId/:movieId", deleteMovie);
router.put("/:rating/:id");
module.exports = router;
