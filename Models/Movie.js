const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const MovieSchema = new mongoose.Schema(
     {
          title: { type: String, required: true, unique: true },
          desc: { type: String },
          genre: { type: String },
          image: { type: String },
          trailer: { type: String },
          year: { type: String },
          language: { type: String },
          isSeries: { type: Boolean, default: false },
          episodes: [],
          ratings: [],
     },
     { timestamps: true },
);

MovieSchema.plugin(mongoosePaginate);
const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
