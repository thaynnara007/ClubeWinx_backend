const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

require('./database');

const corsOptions = {
  origin: '*'
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/', routes);

module.exports = app;
