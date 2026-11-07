const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const AppError = require("../utils/AppError");

function configureGoogleOAuth(passport) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    return false;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const emailVerified = profile._json?.email_verified === true;

          if (!email || !emailVerified) {
            return done(new AppError("A verified Google email is required.", 401));
          }

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });

            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({ email, googleId: profile.id });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  return true;
}

module.exports = configureGoogleOAuth;
