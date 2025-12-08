const Internship = require("../models/Internship");

const createInternship = async (req, res) => {
  try {
    const internshipData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const internship = await Internship.create(internshipData);

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating internship",
      error: error.message,
    });
  }
};

const getAllInternships = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      type,
      status,
      isPaid,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (isPaid !== undefined) {
      query.isPaid = isPaid === "true";
    }

    const sortOptions = {};
    const validSortFields = [
      "createdAt",
      "applicationDeadline",
      "stipend",
      "title",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortField] = order;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const internships = await Internship.find(query)
      .populate("createdBy", "name email company")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Internship.countDocuments(query);

    res.status(200).json({
      success: true,
      count: internships.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching internships",
      error: error.message,
    });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      "createdBy",
      "name email company"
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching internship",
      error: error.message,
    });
  }
};

const updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      internship.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this internship",
      });
    }

    const { createdBy, applicants, ...updateData } = req.body;

    internship = await Internship.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email company");

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating internship",
      error: error.message,
    });
  }
};

const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      internship.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this internship",
      });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting internship",
      error: error.message,
    });
  }
};

const applyToInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This internship is no longer accepting applications",
      });
    }

    const alreadyApplied = internship.applicants.some(
      (applicant) => applicant.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this internship",
      });
    }

    internship.applicants.push({
      user: req.user._id,
      coverLetter: req.body.coverLetter || "",
      appliedAt: new Date(),
      status: "pending",
    });

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error applying to internship",
      error: error.message,
    });
  }
};

const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ createdBy: req.user._id })
      .populate("applicants.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching your internships",
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const internships = await Internship.find({
      "applicants.user": req.user._id,
    })
      .populate("createdBy", "name email company")
      .sort({ createdAt: -1 });

    const applications = internships.map((internship) => {
      const application = internship.applicants.find(
        (app) => app.user.toString() === req.user._id.toString()
      );
      return {
        internship: {
          id: internship._id,
          title: internship.title,
          company: internship.company,
          location: internship.location,
          type: internship.type,
          status: internship.status,
        },
        applicationStatus: application.status,
        appliedAt: application.appliedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching your applications",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicantId, status } = req.body;
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      internship.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update application status",
      });
    }

    const applicant = internship.applicants.find(
      (app) => app.user.toString() === applicantId
    );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    applicant.status = status;
    await internship.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating application status",
      error: error.message,
    });
  }
};

// Get all applications for ONE internship (employer/admin only)
const getInternshipApplications = async (req, res) => {
  try {
    // 1) Find the internship and populate applicant user info
    const internship = await Internship.findById(req.params.id).populate(
      "applicants.user",
      "name email role" // only return these fields from User
    );

    // 2) If not found
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    // 3) Check authorization:
    //    - admin can see any
    //    - employer must be the creator
    if (
      req.user.role !== "admin" &&
      internship.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applications for this internship",
      });
    }

    // 4) Build a clean applications array
    const applications = internship.applicants.map((app) => ({
      applicant: app.user,          // populated user (name, email, role)
      coverLetter: app.coverLetter,
      status: app.status,
      appliedAt: app.appliedAt,     // or app.createdAt if that’s what you used
    }));

    // 5) Send response
    return res.status(200).json({
      success: true,
      count: applications.length,
      internshipId: internship._id,
      internshipTitle: internship.title,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching applications",
      error: error.message,
    });
  }
};


module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getMyInternships,
  getMyApplications,
  updateApplicationStatus,
  getInternshipApplications,
};
