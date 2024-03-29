const express = require('express');
const auth = require('../middlewares/auth');
const poster = require('./poster.route');
const controller = require('../controllers/user.controller');
const connectionController = require('../controllers/connectionRequest.controller');

const router = express.Router();

router.use('/poster', poster);

router.post('/', controller.create);
router.post('/forget/password', controller.forgetPassword);
router.post(
  '/me/request/connection/:userId',
  auth.verifyToken,
  connectionController.requestConnection,
);
router.post(
  '/me/accept/connection/:requestId',
  auth.verifyToken,
  connectionController.acceptConnection,
);
router.delete(
  '/me/refuse/connection/:requestId',
  auth.verifyToken,
  connectionController.refuseConnection,
);
router.get('/', controller.getAll);
router.get('/:userId', auth.verifyToken, controller.getById);
router.get(
  '/me/connection',
  auth.verifyToken,
  connectionController.getConnections,
);
router.put('/', auth.verifyToken, controller.edit);
router.put('/change/password', auth.verifyToken, controller.changePassword);
router.delete('/:userId', auth.verifyToken, controller.delet);

module.exports = router;
