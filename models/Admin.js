const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("./User");

// Admin Schema
const adminSchema = new Schema({
  // Extending User Schema
  // Admins will have all properties from the User Schema
  // Additional properties specific to Admin can be added here
  companyName: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "black",
  },
  companyLocation: {
    type: String,
  },
  companyImage: {
    type: Buffer,
  },
  role: {
    type: String,
    default: "admin",
  },
  companyPhone: {
    type: String,
  },
  website: {
    type: String,
  },
 

  
});

const Admin = User.discriminator("Admin", adminSchema);

module.exports = Admin;
