require('dotenv').config();

const environment = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL,
  API_PORT: process.env.API_PORT || 3000,
  JWT: {
    expirationDays: process.env.JWT_EXPIRES_TIME || 7,
    secret: process.env.JWT_SECRET,
  },
  EMAIL: {
    email: process.env.GMAIL_EMAIL,
    password: process.env.GMAIL_PASSWORD,
  },
};

module.exports = environment;
