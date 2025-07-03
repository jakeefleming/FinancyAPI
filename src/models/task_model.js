// Cursor and ChatGPT helped write this code

import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
