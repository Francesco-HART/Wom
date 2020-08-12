const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const Cookies = require("cookies");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ------------------------------------- \\
// Local strategy
// ------------------------------------- \\
const localLogin = new LocalStrategy({ usernameField: "email" }, function (
  email,
  password,
  done
) {
  // Verify username and password
  User.findOne({ email: email.toLowerCase() }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, "utilisateur non existant");

    // Compare password
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false, "mot de passe invalide");
      let returned_user = Object.assign({}, user);
      returned_user = returned_user._doc;
      delete returned_user.password;
      return done(null, returned_user);
    });
  })
    .select("+password")
    .populate("insta");
});

// ------------------------------------- \\
// JWT Strategy
// ------------------------------------- \\
const cookieExtractor = function ({ cookies }) {
  let token = null;
  if (cookies && cookies.get("jwt")) token = cookies.get("jwt");
  return token;
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  if (payload.sub) done(null, payload.sub);
  else done(null, false);
});

// ------------------------------------- \\
// Signin function
// ------------------------------------- \\
exports.signIn = ({ email, password, context }) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err) return reject(err);
      if (!user) return reject("Identifiants invalides");
      // generate JWT
      const timestamp = new Date().getTime() / 1000;
      const token_infos = {
        _id: user._id,
        type: user.type,
        insta: user.insta || null,
      };
      const token = jwt.sign(
        { sub: token_infos, iat: timestamp },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
      // set the token into the cookies
      new Cookies(context, context.res, { keys: [process.env.COOKIE_KEY] }).set(
        "jwt",
        token,
        {
          maxAge: 12 * 60 * 60 * 1000, // 12h
          signed: true,
          overwrite: true,
        }
      );
      // return
      resolve(user);
    })({ body: { email, password } });
  });
};

// ------------------------------------- \\
// Signout function
// ------------------------------------- \\

exports.signOut = (context) => {
  new Cookies(context, context.res, { keys: [process.env.COOKIE_KEY] }).set(
    "jwt"
  );
};

// use strategies
passport.use(localLogin);
passport.use(jwtLogin);
