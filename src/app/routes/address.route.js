const express = require('express');
const controller = require('../controllers/address.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/me', auth.verifyToken, controller.create);
router.get('/', controller.getAll);
router.get('/me', auth.verifyToken, controller.getByUserId);
router.put('/me', auth.verifyToken, controller.edit);
router.delete('/me', auth.verifyToken, controller.delet);

module.exports = router;
