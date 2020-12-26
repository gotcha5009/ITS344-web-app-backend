const Company = require('../models/CompanyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = process.env.JWT_SECRET;

exports.getCompany = async function (companyId) {
  try {
    var company = await Company.findById(companyId).select('-_id -password');
    return company;
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Category');
  }
};

exports.createCompany = async function (body) {
  try {
    const {
      companyName,
      description,
      email,
      password,
      firstname,
      lastname,
      // imageURL,
    } = body;

    user = await Company.create({
      companyName,
      description,
      email,
      password,
      firstname,
      lastname,
      // imageURL,
    });

    const payload = { email: user.email };

    const token = jwt.sign(payload, `${jwtSecret}`, { expiresIn: '24h' }); // Token is created

    let returnObj = {
      company: {
        companyId: user._id,
        username: user.email,
      },

      accessToken: `Bearer ${token}`, // Token sent to client
      expiresIn: `24h`, // expiration
    };

    return returnObj;
  } catch (err) {
    throw err;
  }
};

exports.changePassword = async (companyId, old_pass, new_pass) => {
  try {
    //check old password
    const { password } = await Company.findById(companyId).select('password');
    console.log({ password });
    if (!bcrypt.compareSync(old_pass, password)) {
      return {
        status: false,
        message: 'incorrect old password',
      };
    } else {
      const salt = await bcrypt.genSalt();
      const new_password = await bcrypt.hash(new_pass, salt);
      // console.log(typeof (companyId));
      const company = await Company.findByIdAndUpdate(
        companyId,
        {
          password: new_password,
        },
        {
          new: true,
          useFindAndModify: false,
        });
      return company ? { status: true } : { status: false, message: "an error occurred" }
    }
  } catch (err) {
    throw err;
  }
};
