const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const workExperienceSchema = new mongoose.Schema({
  company: String, position: String, duration: String, description: String
});


const candidateSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
  },
  summary: {
    type: String,
  },
  role: {
    type : String,
    default:"candidate",
  },
  github: {
    type: String
  },
  linkedIn: {
    type: String
  },
  portfolioWebsite: {
    type: String
  },
  profilePicture: {
    type: Buffer
  },
  phone: {
    type: String
  },
  
  jobsApplied: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  workExperiences: [workExperienceSchema]


});



  

const Candidate = User.discriminator("Candidate", candidateSchema);

module.exports = Candidate;
