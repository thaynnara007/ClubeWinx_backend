const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/profile.controller');

const router = express.Router();

router.post('/', controller.create);
//router.get('/:userId', auth.verifyToken, controller.getProfileByUserId);
router.put('/:userId', auth.verifyToken, controller.edit);
router.delete('/:userId', auth.verifyToken, controller.delet);

module.exports = router;
