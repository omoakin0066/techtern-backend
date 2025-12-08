const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

module.exports = router;
