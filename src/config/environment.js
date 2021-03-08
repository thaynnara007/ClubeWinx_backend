require('dotenv').config();

const environment = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL,
  API_PORT: process.env.API_PORT || 3000,
};

module.exports = environment;
