// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required() {
      return !this.googleId; // password only required if not using Google OAuth
    },
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  googleAccessToken: {
    type: String,
  },
  googleRefreshToken: {
    type: String,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// On Save Hook, encrypt password
userSchema.pre('save', async function beforeUserSave(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    // salt, hash, then set password to hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// comparing passwords
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const comparison = await bcrypt.compare(candidatePassword, this.password);
  return comparison;
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
