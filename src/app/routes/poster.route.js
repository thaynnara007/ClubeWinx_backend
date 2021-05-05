const express = require('express');
const multer = require('../../multer');
const auth = require('../middlewares/auth');
const controller = require('../controllers/poster.controller');
const tagPosterController = require('../controllers/tagPoster.controller');
const posterPictureController = require('../controllers/posterPicture.controller');

const router = express.Router({ mergeParams: true });

router.post('/', auth.verifyToken, controller.create);

router.get('/my', auth.verifyToken, controller.getMy);
router.get('/:posterId/residents', auth.verifyToken, controller.getResidents);
router.get('/:posterId', auth.verifyToken, controller.getById);
router.get('/', auth.verifyToken, controller.getAll);

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

router.delete('/my', auth.verifyToken, controller.delet);

router.post('/me/add/tags', auth.verifyToken, tagPosterController.addTags);
router.put(
  '/me/remove/tags/',
  auth.verifyToken,
  tagPosterController.removeTags,
);

router.post(
  '/me/picture',
  auth.verifyToken,
  multer.single('file'),
  posterPictureController.create,
);
router.delete(
  '/me/picture/:pictureId',
  auth.verifyToken,
  posterPictureController.delet,
);

module.exports = router;
