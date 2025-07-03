// Cursor and ChatGPT helped write this code
import { getGmailClient } from '../services/gmail';
import EmailTemplateModel from '../models/email_template_model';
import ContactModel from '../models/contact_model';

export const sendEmail = async (req, res) => {
  const { templateId, contactId, fieldValues } = req.body;
  try {
    // Get the template and contact
    const template = await EmailTemplateModel.findOne({
      _id: templateId,
      userId: req.user.id,
    });
    const contact = await ContactModel.findOne({
      _id: contactId,
      userId: req.user.id,
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Replace placeholders in the template with field values
    let body = template.content;
    Object.entries(fieldValues).forEach(([key, value]) => {
      body = body.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });

    // Convert newlines to <br> tags for HTML email
    body = body.replace(/\n/g, '<br>');

    const gmail = await getGmailClient(req.user.id);

    const message = [
      `To: ${contact.email}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${template.title}`,
      '',
      body,
    ].join('\r\n');

    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: err.message });
  }
};
