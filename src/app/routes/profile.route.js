const express = require('express');
const multer = require('../../multer');
const auth = require('../middlewares/auth');
const controller = require('../controllers/profile.controller');
const profilePictureController = require('../controllers/profilePicture.controller');

const router = express.Router();

router.get('/me', auth.verifyToken, controller.getProfileByUserId);
router.post('/', auth.verifyToken, controller.create);
router.put('/me', auth.verifyToken, controller.edit);
router.put(
  '/me/picture',
  auth.verifyToken,
  multer.single('file'),
  profilePictureController.edit,
);
router.delete('/me', auth.verifyToken, controller.delet);

module.exports = router;
