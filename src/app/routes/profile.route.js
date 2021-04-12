const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/profile.controller');

const router = express.Router();

router.post('/', auth.verifyToken, controller.create);
router.get('/me', auth.verifyToken, controller.getProfileByUserId);
router.put('/me', auth.verifyToken, controller.edit);
router.delete('/me', auth.verifyToken, controller.delet);

module.exports = router;
