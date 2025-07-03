// Cursor and ChatGPT helped write this code

import { google } from 'googleapis';
import UserModel from '../models/user_model';

export const getGmailClient = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user?.googleAccessToken) {
      throw new Error('No Google access token found. Please sign in with Google again.');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL,
    );

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
    });

    // Test the token by making a simple API call
    try {
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      await gmail.users.getProfile({ userId: 'me' });
      return gmail;
    } catch (error) {
      if (error.code === 401) {
        throw new Error('Google access token is invalid or expired. Please sign in with Google again.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getGmailClient:', error);
    throw error;
  }
};
