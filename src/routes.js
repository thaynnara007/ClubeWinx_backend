const express = require('express');
const user = require('./app/routes/user.route');
const auth = require('./app/routes/auth.route');
const address = require('./app/routes/address.route');
const profile = require('./app/routes/profile.route');

const router = express.Router();

router.get('/', (_, res) => {
  // #swagger.description = 'Rota para testar se a api esta no ar.'

  res.send('WINX :)');
});

router.use('/user', user);
router.use('/auth', auth);
router.use('/address', address);
router.use('/profile', profile);

module.exports = router;
