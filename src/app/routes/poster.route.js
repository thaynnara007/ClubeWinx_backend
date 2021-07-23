const express = require('express');
const multer = require('../../multer');
const auth = require('../middlewares/auth');
const controller = require('../controllers/poster.controller');
const tagPosterController = require('../controllers/tagPoster.controller');
const posterPictureController = require('../controllers/posterPicture.controller');
const posterHeaderController = require('../controllers/posterHeaderImage.controller');

const router = express.Router({ mergeParams: true });

router.get('/', auth.verifyToken, controller.getAll);
router.get('/my', auth.verifyToken, controller.getMy);
router.get('/:posterId/residents', auth.verifyToken, controller.getResidents);
router.get('/:posterId', auth.verifyToken, controller.getById);
router.get(
  '/my/headerImage',
  auth.verifyToken,
  posterHeaderController.getImageHeader,
);

router.post('/', auth.verifyToken, controller.create);
router.post('/me/add/tags', auth.verifyToken, tagPosterController.addTags);
router.post(
  '/me/picture',
  auth.verifyToken,
  multer.single('file'),
  posterPictureController.create,
);
router.post(
  '/me/create/tags',
  auth.verifyToken,
  tagPosterController.createTags,
);

router.put('/my', auth.verifyToken, controller.edit);
router.put(
  '/:posterId/add/resident/:profileId',
  auth.verifyToken,
  controller.addResident,
);
router.put(
  '/:posterId/remove/resident/:profileId',
  auth.verifyToken,
  controller.removeResident,
);
router.put(
  '/me/remove/tags/',
  auth.verifyToken,
  tagPosterController.removeTags,
);
router.put(
  '/my/headerImage',
  auth.verifyToken,
  multer.single('file'),
  posterHeaderController.edit,
);

router.delete('/my', auth.verifyToken, controller.delet);
router.delete(
  '/me/picture/:pictureId',
  auth.verifyToken,
  posterPictureController.delet,
);

module.exports = router;
