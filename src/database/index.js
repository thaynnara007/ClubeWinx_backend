const { sequelize } = require('../app/models');
const config = require('../config/database');
const LogService = require('../app/services/log.service');

sequelize
  .authenticate()
  .then(() => {
    LogService.info(`Sequelize conectado no ambiente *${config.env}*`);
  })
  .catch((err) => {
    LogService.error(
      `Sequelize com problema de conexão em *${config.env}*. \n Erro: ${err}`,
    );
  })
  .done();
