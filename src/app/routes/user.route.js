const express = require('express')
const controller = require('../controllers/user.controller')

const router = express.Router()

router.post('/', controller.create)
router.get('/', controller.getAll)
router.get('/:usuarioId', controller.getById)
router.put('/:usuarioId', controller.edit)
router.delete('/:usuarioId', controller.delet)

module.exports = router;