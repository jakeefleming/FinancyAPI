// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';

const emailTemplateSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // Store the list of customizable fields found in the content
  customizableFields: [{
    type: String,
    trim: true,
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const EmailTemplateModel = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplateModel;
