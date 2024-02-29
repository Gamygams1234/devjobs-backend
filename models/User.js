const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const saltRounds = 10;

// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// authenticate


userSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email }).exec(function (error, user) {
    if (error) {
      return callback(error);
    } else if (!user) {
      let err = new Error("User not found");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (error, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// hashing the password

userSchema.pre("save", function (next) {
  var user = this;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      console.log(user.password);
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});





let User = mongoose.model('User', userSchema);
module.exports = User;
