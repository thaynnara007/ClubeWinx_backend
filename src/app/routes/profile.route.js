const express = require('express');
const multer = require('../../multer');
const auth = require('../middlewares/auth');
const controller = require('../controllers/profile.controller');
const profilePictureController = require('../controllers/profilePicture.controller');
const profileHeaderController = require('../controllers/profileHeaderImage.controller');
const tagProfileController = require('../controllers/tagProfile.controller');

const router = express.Router();

router.get('/me', auth.verifyToken, controller.getMyProfile);
router.get('/', auth.verifyToken, controller.getAllProfile);
router.get('/recomendation', auth.verifyToken, controller.getRecomendation);
router.get('/:userId', auth.verifyToken, controller.getProfileByUserId);
router.get(
  '/me/headerImage',
  auth.verifyToken,
  profileHeaderController.getImageHeader,
);

router.post('/', auth.verifyToken, controller.create);
router.post('/me/add/tags', auth.verifyToken, tagProfileController.addTags);
router.post(
  '/me/create/tags',
  auth.verifyToken,
  tagProfileController.createTags,
);

router.put(
  '/me/remove/tags',
  auth.verifyToken,
  tagProfileController.removeTags,
);
router.put('/me', auth.verifyToken, controller.edit);
router.put(
  '/me/picture',
  auth.verifyToken,
  multer.single('file'),
  profilePictureController.edit,
);
router.put(
  '/me/headerImage',
  auth.verifyToken,
  multer.single('file'),
  profileHeaderController.edit,
);

router.delete('/me/picture', auth.verifyToken, profilePictureController.delet);
router.delete('/me', auth.verifyToken, controller.delet);

module.exports = router;
