const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');
const { User } = require('../models');
const config = require('../../config/environment');

const { StatusCodes } = httpStatus;

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token não fornecido' });
    }

    const [type, token] = authorization.split(' ');

    if (!type || !token || type !== 'Bearer') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado. Token Inválido.' });
    }

    const decoded = jwt.verify(token, config.JWT.secret);

    const user = await User.findByPk(decoded.id);

    req.user = user;

    return next();
  } catch (error) {
    const errorMsg = 'Erro ao verificar token';

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  verifyToken,
};
