const passport = require('passport');
const CompanyService = require('../services/companyService');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

module.exports.signup_post = async (req, res) => {
  try {
    const company = await CompanyService.createCompany(req.body);
    console.log(company);
    res.send(company);
  } catch (err) {
    throw err;
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const company = await CompanyService.getCompany(userId);
    res.send(company);
  } catch (err) {
    throw err;
  }
};

module.exports.changePassword_post = async (req, res) => {
  try {
    const userId = req.user._id;
    const old_pass = req.body.old_pass;
    const new_pass = req.body.new_pass;
    console.log({
      userId,
      old_pass,
      new_pass,
    });
    const result = await CompanyService.changePassword(
      userId,
      old_pass,
      new_pass
    );
    console.log({ result });
    !result.status
      ? res.status(400).send({
        status: 400,
        message: result.message,
      })
      : res.status(200).send({
        status: 200,
        message: 'successful',
      });
  } catch (err) {
    res.send({
      message: err.message,
    });
  }
};
