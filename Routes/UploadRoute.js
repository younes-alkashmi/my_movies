const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

const videoStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          // if the user provide a name to the folder
          if (req.body.name) {
               const folder = req.body.name;
               const path = __dirname + `/../public/videos/${folder}`;
               fs.mkdirSync(path);
               cb(null, `public/videos/${folder}`);
          } else {
               // else make a folder with the name of the original file after removing the extension
               const folder = file.originalname.substring(
                    0,
                    file.originalname.length - 4,
               );
               const path = __dirname + `/../public/videos/${folder}`;
               fs.mkdirSync(path);
               cb(null, `public/videos/${folder}`);
          }
     },
     filename: function (req, file, cb) {
          //   cb(null, Date.now() + "_" + file.originalname);
          cb(null, file.originalname);
     },
});

const uploadVideo = multer({
     storage: videoStorage,
     //  limits: {
     //       fileSize: 100000000, // 100000000 Bytes = 100 MB
     //  },
     fileFilter(req, file, cb) {
          // upload only mp4 and mkv format
          // if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
          if (!file.originalname.match(/\.(mp4)$/)) {
               return cb(new Error("Please upload a video"));
          }
          cb(null, true);
     },
});

const imageStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, "public/images");
     },
     filename: (req, file, cb) => {
          cb(null, req.body.name);
     },
});

const uploadImage = multer({
     storage: imageStorage,
     fileFilter(req, file, cb) {
          // upload only png jpg and jpeg
          if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
               return cb(new Error("Please upload an image"));
          }
          cb(null, true);
     },
});

router.post("/image", uploadImage.single("image"), (req, res) => {
     try {
          return res.status(200).json("Image uploaded successfully");
     } catch (error) {
          console.error(error);
     }
});

router.post("/video", uploadVideo.array("videos"), (req, res) => {
     try {
          res.status(200).json("videos uploaded successfully.");
     } catch (err) {
          res.status(400).json({ message: err });
     }
});

module.exports = router;
