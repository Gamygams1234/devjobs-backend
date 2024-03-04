var express = require("express");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

// GET /
router.get("/", function (req, res) {
  return res.send({ some: "This is for the job" });
});

router.post("/create", verifyToken, function (req, res) {
  const { position, company, contract, postedAt, description, role, requirements } = req.body;

  const userData = { position, company, contract, postedAt, description, role, requirements, company: req.user.userId };

  const job = new Job(userData);
  job
    .save()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().populate("company");
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/findone/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id).populate("company");

    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Could not find job." });
  }
});
router.get("/applicants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id)
      .populate("company")
      .populate({
        path: "applicants",
        populate: {
          path: "applicant",
          model: "Candidate",
        },
      });
    res.json(job.applicants);
  } catch (err) {
    res.status(400).json({ message: "Could not find job." });
  }
});

router.put("/apply/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const job = await Job.findById(id);
    const user = await Candidate.findById(userId);
    job.applicants.push({ applicant: userId });
    user.jobsApplied.push(id);
    await job.save();
    await user.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(400).json({ message: "There was an error processing the request." });
  }
});


router.put("/editjob/:id", verifyToken, async(req, res)=>{
  try{
    const userId = req.user.userId;
    const id = req.params.id;
    

  

      const { position, contract, postedAt, description, role, requirements } = req.body;

      const userData = { position, contract, postedAt, description, role, requirements };
    
       await Job.findByIdAndUpdate(id, userData, { new: true });
      res.status(201).json({ message: "Job updated sucessfully." });

  }
  catch (err) {
    res.status(400).json({ message: "There was an error processing the request." });
  }
})

router.get("/findbyuser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const candidate = await Candidate.findById(id);
    const jobIds = candidate.jobsApplied;
    Job.find({ _id: { $in: jobIds } })
      .populate("company") // Populate appliedJobs field in User model
      .exec((err, jobs) => {
        if (err) {
          console.error(err);
          // Handle error
        } else {
          // Do something with the populated jobs
          res.json(jobs);
        }
      });

    // res.json(candidate.jobsApplied);
  } catch (err) {
    res.status(400).json({ message: "Could not find user." });
  }
});

module.exports = router;
