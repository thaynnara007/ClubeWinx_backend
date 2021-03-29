const { User } = require('../models');

const login = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: {
      include: 'passwordHash',
    },
  });

  if (!user) return null;

  const validPassword = await user.checkPassword(password);

  if (!validPassword) return null;

  delete user.dataValues.passwordHash;

  return {
    token: user.generateAuthToken(),
    user,
  };
};

module.exports = {
  login,
};
