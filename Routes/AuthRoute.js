const {
     login,
     register,
     adminLogin,
     signup,
} = require("../Controllers/AuthController");
const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/login/admin", adminLogin);
router.post("/signup/admin", signup);
module.exports = router;
