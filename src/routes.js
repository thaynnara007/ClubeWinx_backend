const express = require('express');

const router = express.Router();

router.get('/', (_, res) => res.send('WINX :)'));

module.exports = router;
