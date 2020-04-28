const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  JWT_SECRET
} = require('../configuration/index');
// generate token
const signToken = (user) => {
  return jwt.sign({
      iss: "Intermediete",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    JWT_SECRET
  );
};
exports.signup = async (req, res) => {
  try {
    const {
      email,
      name,
      password
    } = req.body.newData;
    //cek email
    const emailFund = await User.findOne({
      email,
    });
    if (emailFund) {
      res.json({
        message: "Email is already in use"
      });
    }
    const newUser = new User({
      email,
      name,
      password
    });
    await newUser.save();
    const token = signToken(newUser);
    res.json({
      success: true,
      access_token: token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
    // console.log(error);

  }
}
exports.login = async (req, res) => {
  try {
    const token = signToken(req.user);
    res.json({
      success: true,
      access_token: token,
    });
  } catch (error) {
    // res.json({
    //   success: false,
    //   message: error,
    // });
    console.log(error);
  }

}