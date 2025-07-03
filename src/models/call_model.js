// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';

const callSchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  date: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
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

const CallModel = mongoose.model('Call', callSchema);

export default CallModel;
