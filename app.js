const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const AuthRoute = require("./Routes/AuthRoute");
const UserRoute = require("./Routes/UserRoute");
const UploadRoute = require("./Routes/UploadRoute");
const MovieRoute = require("./Routes/MovieRoute");

require("dotenv").config();
require("./Database/db").connect();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// To serve images and videos to public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use("/videos", express.static("videos"));

app.listen(port, () => console.log(`server running on port ${port}`));

app.use("/users", UserRoute);
app.use("/auth", AuthRoute);
app.use("/upload", UploadRoute);
app.use("/movies", MovieRoute);
