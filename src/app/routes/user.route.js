const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.post('/', controller.create);
router.post('/forget/password', controller.forgetPassword);
router.get('/', controller.getAll);
router.get('/:userId', auth.verifyToken, controller.getById);
router.put('/:userId', auth.verifyToken, controller.edit);
router.delete('/:userId', auth.verifyToken, controller.delet);

module.exports = router;
