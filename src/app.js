const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

const routes = require('./routes');

require('./database');

const corsOptions = {
  origin: '*',
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/', routes);

module.exports = app;
