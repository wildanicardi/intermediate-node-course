const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const {
  ExtractJwt
} = require("passport-jwt");
const localStrategy = require("passport-local");
const {
  JWT_SECRET
} = require("./configuration/index");
const User = require("./models/User");

//JSON web token strategy
passport.use(
  new jwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        //find users specifiec in token
        const user = await User.findById(payload.sub);
        // if users doesnt exist
        if (!user) {
          done(null, false);
        }
        //otherwise,return user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// local strategy
passport.use(
  new localStrategy({
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        //find the user given the email
        const user = await User.findOne({
          email
        });

        //if not , handle it
        if (!user) {
          return done(null, false);
        }
        //check if the password is correct
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false)
      }
    }
  )
);