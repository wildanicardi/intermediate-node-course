const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = 8000;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
const User = require("./models/User");
mongoose.connect("mongodb://localhost/userData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
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
// response function
function sendResponse(res, err, data) {
  if (err) {
    res.json({
      success: false,
      message: err,
    });
  } else if (!data) {
    res.json({
      success: false,
      message: "Not Found",
    });
  } else {
    res.json({
      success: true,
      data: data,
    });
  }
}
//login
app.post("/auth/login", async (req, res) => {});
// register
app.post("/auth/signup", async (req, res) => {
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
});
// CREATE
app.post("/users", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.newData.password, 10);

  await User.create(
    {
      ...req.body.newData,
      password: hashedPassword,
    },
    (err, data) => {
      sendResponse(res, err, data);
    }
  );
});
app.get("/users", async (req, res) => {
  await User.find({}, (err, data) => {
    sendResponse(res, err, data);
  });
});
app
  .route("/users/:id")
  // READ
  .get(async (req, res) => {
    await User.findById(req.params.id, (err, data) => {
      sendResponse(res, err, data);
    });
  })
  // UPDATE
  .put(async (req, res) => {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body.newData,
      },
      {
        new: true,
      },
      (err, data) => {
        sendResponse(res, err, data);
      }
    );
  })
  // DELETE
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id, (err, data) => {
      sendResponse(res, err, data);
    });
  });
