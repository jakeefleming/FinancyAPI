// Cursor and ChatGPT helped write this code
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const fetchPersonData = async (linkedinUrl) => {
  try {
    const response = await axios.get('https://api.peopledatalabs.com/v5/person/enrich', {
      params: {
        profile: linkedinUrl,
        min_likelihood: 5,
        required: ['name'],
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.PDL_API_KEY,
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error('No data returned from PDL');
    }

    return response.data.data;
  } catch (error) {
    console.error('PDL API Error:', error.response?.data || error.message);
    throw new Error(
      typeof error.response?.data?.error === 'string'
        ? error.response.data.error
        : JSON.stringify(error.response?.data || { message: 'Unknown error from PDL' }),
    );
  }
};

export const fetchCompanyData = async (linkedinUrl) => {
  try {
    const response = await axios.get('https://api.peopledatalabs.com/v5/company/enrich', {
      params: {
        profile: linkedinUrl,
        min_likelihood: 5,
        required: ['name', 'website', 'linkedin_url', 'industry', 'size'],
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.PDL_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      typeof error.response?.data?.error === 'string'
        ? error.response.data.error
        : JSON.stringify(error.response?.data || { message: 'Unknown error from PDL' }),
    );
  }
};

export const mapPersonToContact = (pdlData) => {
  return {
    firstName: pdlData.first_name,
    lastName: pdlData.last_name,
    email: pdlData.work_email || pdlData.personal_emails?.[0],
    linkedin: pdlData.linkedin_url,
    university: pdlData.education?.[0]?.school?.name,
    position: pdlData.job_title,
    notes: [],
    relationshipStrength: 0,
    lastContactDate: new Date(),
    tags: pdlData.skills || [],
  };
};

export const mapCompanyToModel = (pdlData) => {
  return {
    name: pdlData.name,
    industry: pdlData.industry,
    location: pdlData.location?.name,
    applicationName: pdlData.name,
    applicationLink: pdlData.website,
    applicationStatus: 'Networking',
    notes: [],
  };
};
