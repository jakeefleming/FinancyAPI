// Cursor and ChatGPT helped write this code

import { Router } from 'express';
import * as Companies from './controllers/company_controller';
import * as Contacts from './controllers/contact_controller';
import * as Tasks from './controllers/task_controller';
import * as Calls from './controllers/call_controller';
import * as UserController from './controllers/user_controller';
import * as EmailTemplates from './controllers/email_template_controller';
import * as EmailController from './controllers/email_controller';
import signS3 from './services/s3';
import {
  requireAuth, requireSignin, requireGoogle, handleGoogleCallback,
} from './services/passport';
import { requireGoogleToken } from './middleware/requireGoogleToken';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Personal CRM API!' });
});

// Added for S3 image routes
router.get('/sign-s3', signS3);

// Auth routes
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({
      token, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({
      token, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

// User info route
router.get('/me', requireAuth, UserController.getMe);

// Protected routes
router
  .route('/companies')
  .get(requireAuth, Companies.getAllCompanies)
  .post(requireAuth, Companies.createCompany);

router
  .route('/companies/:id')
  .get(requireAuth, Companies.getCompanyById)
  .put(requireAuth, Companies.updateCompany)
  .delete(requireAuth, Companies.deleteCompany);

router
  .route('/contacts')
  .get(requireAuth, Contacts.getAllContacts)
  .post(requireAuth, Contacts.createContact);

// Add PDL enrichment route
router.post('/contacts/enrich', requireAuth, Contacts.enrichContact);

// Add company enrichment route
router.post('/companies/enrich', requireAuth, Companies.enrichCompany);

router
  .route('/contacts/:id')
  .get(requireAuth, Contacts.getContactById)
  .put(requireAuth, Contacts.updateContact)
  .delete(requireAuth, Contacts.deleteContact);

router
  .route('/tasks')
  .get(requireAuth, Tasks.getAllTasks)
  .post(requireAuth, Tasks.createTask);

router
  .route('/tasks/:id')
  .get(requireAuth, Tasks.getTaskById)
  .put(requireAuth, Tasks.updateTask)
  .delete(requireAuth, Tasks.deleteTask);

router
  .route('/calls')
  .get(requireAuth, Calls.getAllCalls)
  .post(requireAuth, Calls.createCall);

router
  .route('/calls/:id')
  .get(requireAuth, Calls.getCallById)
  .put(requireAuth, Calls.updateCall)
  .delete(requireAuth, Calls.deleteCall);

// Email template routes
router
  .route('/emails')
  .get(requireAuth, EmailTemplates.getAllEmailTemplates);

router
  .route('/emails/create')
  .post(requireAuth, EmailTemplates.createEmailTemplate);

router
  .route('/emails/:id')
  .get(requireAuth, EmailTemplates.getEmailTemplateById)
  .put(requireAuth, EmailTemplates.updateEmailTemplate)
  .delete(requireAuth, EmailTemplates.deleteEmailTemplate);

// Email sending route
router.post('/emails/send', requireAuth, requireGoogleToken, EmailController.sendEmail);

// Google OAuth routes
router.get('/auth/google', requireGoogle);

router.get('/auth/google/callback', handleGoogleCallback, (req, res) => {
  try {
    // Log the tokens for debugging
    console.log('Google OAuth Callback - Tokens:', {
      accessToken: req.user.googleAccessToken,
      refreshToken: req.user.googleRefreshToken,
    });

    const token = UserController.signin(req.user);
    
    // Return user info along with token
    const userInfo = {
      token,
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      googleAccessToken: req.user.googleAccessToken,
      googleRefreshToken: req.user.googleRefreshToken,
    };

    // Log the user info for debugging
    console.log('Google OAuth Callback - User Info:', userInfo);

    // Encode the data for URL safety
    const encodedData = encodeURIComponent(JSON.stringify(userInfo));
    res.redirect(`https://project-financy.onrender.com/auth/callback?data=${encodedData}`);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.redirect(`https://project-financy.onrender.com/auth/error?message=${error.message}`);
  }
});

router.get('/auth/google/failure', (req, res) => {
  res.redirect('https://project-financy.onrender.com/auth/error?message=Google authentication failed');
});

export default router;
