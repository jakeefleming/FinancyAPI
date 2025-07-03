// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';

const contactSchema = new Schema({
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
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  university: {
    type: String,
    trim: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  position: {
    type: String,
    trim: true,
  },
  headshotURL: {
    type: String,
    trim: true,
  },
  notes: [{
    type: String,
    trim: true,
  }],
  relationshipStrength: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  lastContactDate: {
    type: Date,
    default: Date.now,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const ContactModel = mongoose.model('Contact', contactSchema);

export default ContactModel;
