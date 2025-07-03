// Cursor and ChatGPT helped write this code

import ContactModel from '../models/contact_model';
import {
  fetchPersonData, fetchCompanyData, mapPersonToContact, mapCompanyToModel,
} from '../services/pdl';

export const createContact = async (req, res) => {
  try {
    const contact = new ContactModel({
      ...req.body,
      userId: req.user.id,
    });
    await contact.save();
    // populate company details after saving
    await contact.populate('companyId');
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find({ userId: req.user.id }).populate('companyId');
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await ContactModel.findOne({ _id: req.params.id, userId: req.user.id }).populate('companyId');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await ContactModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    ).populate('companyId');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    return res.status(200).json(contact);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await ContactModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const enrichContact = async (req, res) => {
  try {
    const { linkedin_url: linkedinUrl } = req.body;
    if (!linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required' });
    }

    console.log('Fetching person data for:', linkedinUrl);
    const personData = await fetchPersonData(linkedinUrl);
    console.log('Received person data:', personData);

    if (!personData) {
      return res.status(404).json({ message: 'No data found for this LinkedIn profile' });
    }

    const contactData = mapPersonToContact(personData);
    console.log('Mapped contact data:', contactData);

    let companyData = null;
    if (personData.job_company_linkedin_url) {
      try {
        console.log('Fetching company data for:', personData.job_company_linkedin_url);
        const fetchedCompany = await fetchCompanyData(personData.job_company_linkedin_url);
        if (fetchedCompany) {
          companyData = mapCompanyToModel(fetchedCompany);
          console.log('Mapped company data:', companyData);
        }
      } catch (error) {
        console.error('Company enrichment failed:', error.message);
        // fail silently on company enrichment
      }
    }

    return res.status(200).json({
      contact: contactData,
      company: companyData,
    });
  } catch (error) {
    console.error('Contact enrichment error:', error);
    return res.status(500).json({ message: error.message });
  }
};
