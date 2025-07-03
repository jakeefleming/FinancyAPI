// Cursor and ChatGPT helped write this code
import CompanyModel from '../models/company_model';
import { fetchCompanyData, mapCompanyToModel } from '../services/pdl';

export const createCompany = async (req, res) => {
  try {
    const company = new CompanyModel({
      ...req.body,
      userId: req.user.id,
    });
    await company.save();
    return res.status(201).json(company);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.find({ userId: req.user.id });
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await CompanyModel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.status(200).json(company);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await CompanyModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.status(200).json(company);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await CompanyModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const enrichCompany = async (req, res) => {
  try {
    const { linkedin_url: linkedinUrl } = req.body;
    if (!linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required' });
    }

    console.log('Calling fetchCompanyData with URL:', linkedinUrl);

    // Fetch company data from PDL
    const companyData = await fetchCompanyData(linkedinUrl);
    if (!companyData) {
      return res.status(404).json({ message: 'No data found for this company' });
    }

    // Map PDL data to our company model
    const mappedCompanyData = mapCompanyToModel(companyData);

    return res.status(200).json({
      company: mappedCompanyData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
