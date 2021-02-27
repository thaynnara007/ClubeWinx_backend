require('dotenv').config();

const LogService = require('./app/services/log.service');

const environment = require('./config/environment');

const { BASE_URL, PORT } = environment;

const app = require('./app');

app.listen(PORT, () => {
  LogService.log(`API rodando em http://${BASE_URL}:${PORT}/`);
});
