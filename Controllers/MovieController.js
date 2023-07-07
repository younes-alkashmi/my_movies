const Movie = require("../Models/Movie");
const Admin = require("../Models/Admin");
const User = require("../Models/User");

const getMovies = async (req, res) => {
     const pageNumber = req.query.page || 1;
     const pageSize = 10; // Number of items per page

     Movie.paginate(
          {},
          { page: pageNumber, limit: pageSize },
          (err, result) => {
               if (err) {
                    return res.status(500).json({
                         message: "Error occurred while fetching movies.",
                    });
               }

               const { docs, total, limit, page, pages } = result;
               res.status(200).json({
                    movies: docs,
                    total,
                    limit,
                    page,
                    pages,
               });
          },
     );
};

const uploadMovie = async (req, res) => {
     const { id } = req.body;
     try {
          const user = await Admin.findById(id);

          if (!user) {
               return res.status(403).json("Access denied...!");
          }

          let movie = await Movie.findOne({ title: req.body.title });
          if (movie) {
               await movie.updateOne({
                    $push: {
                         episodes: {
                              $each: req.body.episodes,
                         },
                    },
               });
               return res.status(200).json("episodes added successfully!");
          }
          movie = new Movie(req.body);
          movie.save();
          res.status(201).json("movie added successfully!");
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

const getMovie = async (req, res) => {
     const { id } = req.params;

     try {
          const movie = await Movie.findById(id);
          res.status(200).json(movie);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

const deleteMovie = async (req, res) => {
     const { userId, movieId } = req.params;

     try {
          const user = await Admin.findById(userId);
          if (!user) return res.status(403).json("Action denied...!");

          const movie = await Movie.findOneAndDelete({ _id: movieId });
          res.status(200).json(`${movie.title} deleted successfully.`);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

const rateMovie = async (req, res) => {
     const { rating, userId, movieId } = req.params;

     try {
          const user = await User.findById(userId);
          const movie = await Movie.findById(movieId);

          if (!user || !movie || !rating) {
               return res.status(400).json("ids and rating are required");
          } else if (isNaN(rating)) {
               return res.status(400).json("rating has to be number");
          }
          await movie.updateOne({
               $push: {
                    ratings: {
                         userId,
                         rating,
                    },
               },
          });

          res.status(200).json("rated successfully!");
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

module.exports = { uploadMovie, deleteMovie, getMovie, getMovies, rateMovie };
