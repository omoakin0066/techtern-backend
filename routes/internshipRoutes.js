const express = require("express");
const router = express.Router();

const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getMyInternships,
  getMyApplications,
  updateApplicationStatus,
  getInternshipApplications
} = require("../controllers/internshipController");

const { protect, authorize } = require("../middleware/auth");

router.get("/", getAllInternships);
router.get("/my-internships", protect, authorize("employer", "admin"), getMyInternships);
router.get("/my-applications", protect, authorize("student"), getMyApplications);
router.post("/", protect, authorize("employer", "admin"), createInternship);

router.get("/:id/applications", protect, authorize("employer", "admin"), getInternshipApplications);
router.post("/:id/apply", protect, authorize("student"), applyToInternship);
router.put("/:id/application-status", protect, authorize("employer", "admin"), updateApplicationStatus);

router.get("/:id", getInternshipById);
router.put("/:id", updateInternship);
router.delete("/:id", protect, authorize("employer", "admin"), deleteInternship);

module.exports = router;