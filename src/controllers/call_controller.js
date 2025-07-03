// Cursor and ChatGPT helped write this code
import CallModel from '../models/call_model';
import ContactModel from '../models/contact_model';

export const createCall = async (req, res) => {
  try {
    const callData = { ...req.body, userId: req.user.id };

    // If contactId is provided, get the contact's companyId
    if (callData.contactId) {
      const contact = await ContactModel.findById(callData.contactId).select('companyId');
      if (contact?.companyId) {
        callData.companyId = contact.companyId;
      }
    }

    const call = new CallModel(callData);
    await call.save();
    // populate contact and company details after saving
    await call.populate(['contactId', 'companyId']);
    return res.status(201).json(call);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllCalls = async (req, res) => {
  try {
    const calls = await CallModel.find({ userId: req.user.id }).populate(['contactId', 'companyId']);
    return res.status(200).json(calls);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCallById = async (req, res) => {
  try {
    const call = await CallModel.findOne({ _id: req.params.id, userId: req.user.id }).populate(['contactId', 'companyId']);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }
    return res.status(200).json(call);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCall = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If contactId is being updated, get the contact's companyId
    if (updateData.contactId) {
      const contact = await ContactModel.findById(updateData.contactId).select('companyId');
      if (contact?.companyId) {
        updateData.companyId = contact.companyId;
      }
    }

    const call = await CallModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true },
    ).populate(['contactId', 'companyId']);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }
    return res.status(200).json(call);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCall = async (req, res) => {
  try {
    const call = await CallModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }
    return res.status(200).json({ message: 'Call deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
