const User = require("./models/User");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (passport) {
  // oauth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_ID_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          let user = await User.find({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create({ ...profile });
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
