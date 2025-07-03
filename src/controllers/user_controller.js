// Cursor and ChatGPT helped write this code

import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import UserModel from '../models/user_model';

dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    googleAccessToken: user.googleAccessToken,
    googleRefreshToken: user.googleRefreshToken,
  }, process.env.AUTH_SECRET);
}

export const signin = (user) => {
  return tokenForUser(user);
};

export const signup = async ({
  email, password, firstName, lastName,
}) => {
  if (!email || !password || !firstName || !lastName) {
    throw new Error('You must provide email, password, firstName, and lastName');
  }

  // See if a user with the given email exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  // Create a new user
  const user = new UserModel({
    email,
    password,
    firstName,
    lastName,
  });

  await user.save();
  return tokenForUser(user);
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
