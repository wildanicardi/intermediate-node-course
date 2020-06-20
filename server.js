const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const {
  signup,
  login
} = require('./controller/Auth');
const {
  index,
  deleteUser,
  updateUser,
  showUser,
  createUser
} = require('./controller/Users');
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
mongoose.connect("mongodb://localhost/userData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));
const passport = require('passport');
const passportConf = require('./passport');
const passportLogin = passport.authenticate('local', {
  session: false
});
const passportJwt = passport.authenticate('jwt', {
  session: false
});
//login
app.post("/auth/login", passportLogin, login);
// register
app.post("/auth/signup", signup);
// CREATE
app.post("/users", createUser);
app.get("/users", passportJwt, index);
app
  .route("/users/:id")
  // READ
  .get(passportJwt, showUser)
  // UPDATE
  .put(passportJwt, updateUser)
  // DELETE
  .delete(passportJwt, deleteUser);