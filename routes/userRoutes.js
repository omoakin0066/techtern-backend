const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;
