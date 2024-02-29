var express = require("express");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Job = require("../models/Job");

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


router.get("/findone/:id", async(req, res)=>{
  try {
    const id = req.params.id 
    const job = await Job.findById(id).populate("company");
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Could not find job." });
  }

})

module.exports = router;
