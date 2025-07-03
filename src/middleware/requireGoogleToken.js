// Cursor and ChatGPT helped write this code

import UserModel from '../models/user_model';

export const requireGoogleToken = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user?.googleAccessToken) {
      return res.status(403).json({ 
        message: 'Google account not authorized for Gmail access. Please sign in with Google again to grant Gmail permissions.' 
      });
    }
    next();
  } catch (error) {
    console.error('Error in requireGoogleToken:', error);
    return res.status(500).json({ 
      message: 'Error checking Google authentication status. Please try signing in with Google again.' 
    });
  }
};
