const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/poster.controller');

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

module.exports = router;
