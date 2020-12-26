const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

const CompanySchema = Schema({
  companyName: {
    type: String,
    required: [true, 'Please enter your company name'],
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  firstname: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastname: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  imageURL: {
    imageURL: { type: String, default: '' },
  },
  isRestricted: {
    type: Boolean,
    default: false,
  },
});

CompanySchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
