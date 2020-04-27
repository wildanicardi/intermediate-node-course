const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// generate token
const signToken = (user) => {
  return jwt.sign(
    {
      iss: "Intermediete",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    "intermedieteauthentication"
  );
};
exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.newData.password, 10);
    const { email, name } = req.body.newData;
    //cek email
    const emailFund = await User.findOne({
      email,
    });
    if (emailFund) {
      res.json({ message: "Email is already in use" });
    }
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
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
  }
}
exports.login = async (req, res) => {}