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
});
const passport = require('passport');
const passportConf = require('./passport');
//login
app.post("/auth/login", login);
// register
app.post("/auth/signup", signup);
// CREATE
app.post("/users", createUser);
app.get("/users", passport.authenticate('jwt', {
  session: false
}), index);
app
  .route("/users/:id")
  // READ
  .get(showUser)
  // UPDATE
  .put(updateUser)
  // DELETE
  .delete(deleteUser);