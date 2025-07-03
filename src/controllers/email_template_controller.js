// Cursor and ChatGPT helped write this code
import EmailTemplateModel from '../models/email_template_model';

// Asked ChatGPT to extract customizable fields from content
const extractCustomizableFields = (content) => {
  const fieldRegex = /\[([^\]]+)\]/g;
  const fields = [];
  let match = fieldRegex.exec(content);

  while (match !== null) {
    fields.push(match[1]);
    match = fieldRegex.exec(content);
  }

  return [...new Set(fields)];
};

export const createEmailTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;

    const customizableFields = extractCustomizableFields(content);

    const template = new EmailTemplateModel({
      title,
      content,
      customizableFields,
      userId: req.user.id,
    });

    await template.save();
    return res.status(201).json(template);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplateModel.find({ userId: req.user.id });
    return res.status(200).json(templates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEmailTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplateModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }

    return res.status(200).json(template);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEmailTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;

    const customizableFields = extractCustomizableFields(content);

    const template = await EmailTemplateModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, customizableFields },
      { new: true, runValidators: true },
    );

    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }

    return res.status(200).json(template);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplateModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }

    return res.status(200).json({ message: 'Email template deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
