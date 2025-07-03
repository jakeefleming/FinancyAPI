// Cursor and ChatGPT helped write this code
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

import UserModel from '../models/user_model';

// loads in .env file if needed
dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
const localOptions = { usernameField: 'email' };

// options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};

// username/email + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  let user;
  let isMatch;

  try {
    user = await UserModel.findOne({ email });
    if (!user) {
      return done(null, false);
    }
    isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (error) {
    return done(error);
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  let user;
  try {
    user = await UserModel.findById(payload.sub);
  } catch (error) {
    done(error, false);
  }
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// Google OAuth strategy
const googleLogin = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
  ],
  accessType: 'offline',
  prompt: 'consent',
  includeGrantedScopes: true,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Log the tokens for debugging
    console.log('Google Strategy - Received tokens:', {
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing',
    });

    // Check if user already exists
    const existingUser = await UserModel.findOne({ googleId: profile.id });
    if (existingUser) {
      console.log('Google Strategy - Updating existing user tokens');
      existingUser.googleAccessToken = accessToken;
      if (refreshToken) {
        console.log('Google Strategy - Storing new refresh token');
        existingUser.googleRefreshToken = refreshToken;
      }
      await existingUser.save();
      return done(null, existingUser);
    }

    // Create new user if doesn't exist
    console.log('Google Strategy - Creating new user with tokens');
    const newUser = new UserModel({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error, false);
  }
});

// Tell passport to use these strategies
passport.use(jwtLogin); // for 'jwt'
passport.use(localLogin); // for 'local'
passport.use(googleLogin); // for 'google'

// middleware functions to use in routes
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
export const requireGoogle = passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
  ],
  accessType: 'offline',
  prompt: 'consent'
});
export const handleGoogleCallback = passport.authenticate('google', {
  failureRedirect: '/auth/google/failure',
  session: false,
});
