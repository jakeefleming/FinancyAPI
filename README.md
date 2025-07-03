# Financy API

Links:
- https://project-financy.onrender.com
- https://project-api-financy.onrender.com

This backend will serve our finance focused personal CRM. It will be used to store the data for each user, 
including their contacts, resumes, events, meeting notes, applications, email templates, to-do items, etc.

## Notes

We had a section called "calls" that we decided to take out of the frontend because we didn't find it partcularly useful (same functionality as tasks). However, the code is still here in the backend in case we want add it back later.


## Architecture

We will created a REST API using an Express.js server with a MongoDB database via Mongoose.

We also use to include authentication via Google to be able to send emails and read responses through our service. For this, we will use Google API OAuth 2.0. We will store the necessary tokens in MongoDB. For our Gmail API integration, we will use Google APIs Node.js client.

Tools:
1) Express
2) MongoDB / Mongoose
3) s3
4) Morgan
5) Cors
6) Google Passport
7) Dotenv
8) Axios
9) googleapis
10) People Data Labs

## Setup

* npm install
* npm run dev (to get the server running)

## Deployment

* Host a web service on Render
* Need key from MongoDB to include in Render environment variable

# starter express app template

* node with babel
* expressjs
* airbnb eslint rules

Settings for render.com:
* build command:  `npm install && npm run build`
* run command:  `npm run prod`

## Authors

Ansh M., Nate A., Jake F., Mitchelle N.

## Acknowledgments

All of Tim's short assignments, Lab 5, ChatGPT, Cursor, CS52 TAs
