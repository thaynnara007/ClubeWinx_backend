const multer = require('multer');
const { FIVE_MB } = require('../app/services/util.service');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FIVE_MB,
  },
});

module.exports = upload;
