const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const session = require("express-session");
const passport = require("passport");
require("./passport")(passport);
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
mongoose
  .connect("mongodb://localhost/userData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());
app.use(passport.session());

//Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/", (req,res) => {
  res.send("Hello World");
});
app.get("/dashboard", (req,res) => {
  res.send("Dashboard");
});

//auth with google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
// google auth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);
