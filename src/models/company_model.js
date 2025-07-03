// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  applicationName: {
    type: String,
    trim: true,
  },
  applicationLink: {
    type: String,
    trim: true,
  },
  applicationStatus: {
    type: String,
    enum: ['Networking', 'Not Applying', 'Applied', '1st Round Interview', '2nd Round Interview', '3rd Round Interview', 'Final Round Interview', 'Offer', 'Rejected'],
    default: 'Networking',
  },
  applicationDueDate: {
    type: Date,
  },
  notes: [{
    type: String,
    trim: true,
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const CompanyModel = mongoose.model('Company', companySchema);

export default CompanyModel;
