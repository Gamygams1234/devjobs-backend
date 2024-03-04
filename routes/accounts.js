require("dotenv").config();
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/verifyToken");
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /
router.get("/", function (req, res) {
  return res.send({ some: "json" });
});

// Post Create User/
router.post("/create/candidate", upload.single("profilePicture"), function (req, res, next) {
  const { firstName, lastName, email, password, workExperiences } = req.body;
  // console.log({ firstName, lastName, email, password , workExperiences});

  if (firstName && lastName && email && password) {
    let userData = {
      email,
      firstName,
      lastName,
      password,
      workExperiences:JSON.parse( workExperiences)
    }
    if (req.file) {
      userData.profilePicture = req.file.buffer;
    }

    if (req.body.phone) {
      userData.phone = req.body.phone;
    }
    if (req.body.website) {
      userData.website = req.body.website;
    }
    if (req.body.portfolioWebsite) {
      userData.portfolio = req.body.portfolioWebsite;
    }
    if (req.body.linkedIn) {
      userData.linkedIn = req.body.linkedIn;
    }
    if (req.body.headline) {
      userData.headline = req.body.headline;
    }
    if (req.body.github) {
      userData.github = req.body.github;
    }
    if (req.body.summary) {
      userData.summary = req.body.summary;
    }
    const newUser = new Candidate(userData);
    newUser
      .save()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  } else {
    return res.status(401).json({ message: "Please fill all required information!" });
  }
});

// Post Create User/
router.post("/create/admin", upload.single("companyImage"), function (req, res, next) {
  const { email, password, website, companyName, backgroundColor, companyLocation, portfolioWebsite } = req.body;

  if (email && password && companyName && website) {
    let userData = {
      email: email,
      password: password,
      companyName: companyName,
    };
    if (req.body.companyPhone) {
      userData.companyPhone = req.body.companyPhone;
    }

    if (req.file) {
      userData.companyImage = req.file.buffer;
    }

    if (req.body.portfolioWebsite) {
      userData.portfolioWebsite = portfolioWebsite;
    }
    if (req.body.backgroundColor) {
      userData.backgroundColor = backgroundColor;
    }
    if (req.body.companyLocation) {
      userData.companyLocation = companyLocation;
    }
    const newAdmin = new Admin(userData);
    newAdmin
      .save()
      .then((admin) => {
        res.json(admin);
        // req.session.userId = user._id;
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({ message: "Company Already Exists" });
      });
  } else {
    return res.status(401).json({ message: "Please fill all required information!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).exec(function (error, user) {
    if (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    bcrypt.compare(password, user.password, function (error, result) {
      if (result === true) {
        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
        res.json({ token });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    });
  });
});

router.get("/users", (req, res) => {
  User.find({}, "", (err, users) => {
    if (err) {
      console.log(err.message);
    } else {
      let data = users.map((user, index) => {
        if (user.profilePicture) {
          user.profilePicture = person.profilePicture.toString("base64");
        }
        return user;
      });

      res.send(data);
    }
  });
});
// get user by id

router.get("/users/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      // console.log(err.message);
    } else {
      if (user.profilePicture) {
        let data = user;
        res.send(data);
      } else {
        let data = user;
      
        res.send(data);
      }
    }
  });
});
// update
router.put("/update/candidate", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, email, workExperiences } = req.body;

      let userData = {
        email,
        firstName,
        lastName,
        workExperiences:JSON.parse( workExperiences)
      }
    if (req.file) {
      userData.profilePicture = req.file.buffer;
    }

    if (req.body.phone) {
      userData.phone = req.body.phone;
    }
    if (req.body.website) {
      userData.website = req.body.website;
    }
    if (req.body.portfolioWebsite) {
      userData.portfolio = req.body.portfolioWebsite;
    }
    if (req.body.linkedIn) {
      userData.linkedIn = req.body.linkedIn;
    }
    if (req.body.headline) {
      userData.headline = req.body.headline;
    }
    if (req.body.github) {
      userData.github = req.body.github;
    }
    if (req.body.summary) {
      userData.summary = req.body.summary;
    }
    if (req.file) {
      userData.profilePicture = req.file.buffer;
    }

    const updatedUser = await Candidate.findByIdAndUpdate(req.user.userId, userData, { new: true });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// update

router.put("/update/admin", verifyToken,upload.single("companyImage"), async (req, res) => {
  try {
  

    let { companyName, backgroundColor, companyLocation,  email, website, companyPhone}  = req.body;

    let userData = { companyName, backgroundColor, companyLocation, email, website, companyPhone} 

    if (req.file) {
      userData.companyImage = req.file.buffer;
    }

     await Admin.findByIdAndUpdate(req.user.userId, userData, { new: true });
     res.status(201).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await User.deleteOne({ _id: id });
    return res.status(200).json({ message: `Deleted ${result.deletedCount} user.` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
