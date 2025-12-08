const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    stipend: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    startDate: {
      type: Date,
    },
    positions: {
      type: Number,
      default: 1,
      min: [1, "At least one position is required"],
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["open", "closed", "filled"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        coverLetter: {
          type: String,
          trim: true,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

internshipSchema.index({ title: "text", company: "text", description: "text" });
internshipSchema.index({ category: 1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ type: 1 });
internshipSchema.index({ status: 1 });

module.exports = mongoose.model("Internship", internshipSchema);
