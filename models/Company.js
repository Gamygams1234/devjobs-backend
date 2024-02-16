const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


const { ObjectId } = mongoose.Schema;

const companySchema = new Schema({
    name:{type: String},
    logoBackground: {type: String},
    location: {type: String},
    password: {type:String},
    email: {type: String},
    website: {type: String},
})

// hash the password
companySchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  // checking if password is valid
companySchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };


  let Company = mongoose.model('company', companySchema);

  module.exports = Company;