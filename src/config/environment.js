require('dotenv').config();

const environment = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT || 3000,
};

module.exports = environment;
