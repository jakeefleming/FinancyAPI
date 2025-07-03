// Cursor and ChatGPT helped write this code

import TaskModel from '../models/task_model';
import ContactModel from '../models/contact_model';

export const createTask = async (req, res) => {
  try {
    const taskData = { ...req.body, userId: req.user.id };

    // If contactId is provided, get the contact's companyId
    if (taskData.contactId) {
      const contact = await ContactModel.findById(taskData.contactId).select('companyId');
      if (contact?.companyId) {
        taskData.companyId = contact.companyId;
      }
    }

    const task = new TaskModel(taskData);
    await task.save();

    // Populate fields separately if they exist
    if (task.contactId) {
      await task.populate('contactId');
    }
    if (task.companyId) {
      await task.populate('companyId');
    }

    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.user.id });

    // Populate fields separately for each task
    const populatedTasks = await Promise.all(tasks.map(async (task) => {
      if (task.contactId) {
        await task.populate('contactId');
      }
      if (task.companyId) {
        await task.populate('companyId');
      }
      return task;
    }));

    return res.status(200).json(populatedTasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Populate fields separately if they exist
    if (task.contactId) {
      await task.populate('contactId');
    }
    if (task.companyId) {
      await task.populate('companyId');
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If contactId is being updated, get the contact's companyId
    if (updateData.contactId) {
      const contact = await ContactModel.findById(updateData.contactId).select('companyId');
      if (contact?.companyId) {
        updateData.companyId = contact.companyId;
      }
    }

    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Populate fields separately if they exist
    if (task.contactId) {
      await task.populate('contactId');
    }
    if (task.companyId) {
      await task.populate('companyId');
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
