const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  upgrade,
  getUsers,
  getUser,
} = require("../Controllers/UserController");

router.get("/:id/all", getUsers);
router.get("/search/:id", getUser);
router.put("/update", updateUser);
router.delete("/remove", deleteUser);
router.put("/update/:id", upgrade);

module.exports = router;
