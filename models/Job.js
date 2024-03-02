const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");
const Admin = require("./Admin");

// Admin Schema
const jobSchema = new Schema({
  // Extending User Schema
  // Admins will have all properties from the User Schema
  // Additional properties specific to Admin can be added here
  position: {
    type: String,
    required: true,
  },
  company: { type: Schema.Types.ObjectId, ref: "Admin" },

  contract: {
    type: String,
    required: true,
    default: "Full Time",
  },
  postedAt: {
    type: Date,
    default: Date.now(),
  },

  applicants: [
    {
      applicant: { type: Schema.Types.ObjectId, ref: "Candidate" },
      appliedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  description: {
    type: String,
  },
  role: {
    content: {
      type: String,
    },

    items: { type: [String] },
  },
  requirements: {
    content: {
      type: String,
    },
    items: { type: [String] },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

let Job = mongoose.model("Job", jobSchema);

module.exports = Job;
