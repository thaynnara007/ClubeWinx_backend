const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', controller.login);
router.post('/verify/code', controller.verifyCode);

module.exports = router;
