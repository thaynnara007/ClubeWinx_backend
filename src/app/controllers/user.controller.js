const httpStatus = require('http-status-codes');
const moment = require('moment');
const {
  DATE_FORMAT,
  FORGET_PASSWORD_CODE_MIN,
  FORGET_PASSWORD_CODE_MAX,
  getRandomNumber,
} = require('../services/util.service');
const log = require('../services/log.service');
const service = require('../services/user.service');
const emailService = require('../services/email.service');
const addressService = require('../services/address.service');
const profileService = require('../services/profile.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para criar um usuário.'
  /* #swagger.parameters['newUser'] = {
        in: 'body',
        description: 'Informações do usuário.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/AddUser" }
        } */
  /* #swagger.responses[201] = {
              schema: { $ref: "#/definitions/User" },
              description: 'Novo usuário criado.'
        } */
  try {
    const { body } = req;
    const { email, birthday } = body;

    log.info(`Iniciando cadastro do usuário ${email}`);
    log.info(`Verificando existencia do email ${email}`);

    const existedUser = await service.getByEmail(email);

    if (existedUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Email já cadastrado' });
    }

    const bDay = moment(birthday, DATE_FORMAT).toDate();

    const userData = {
      name: body.name,
      lastname: body.lastname,
      birthday: bDay,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      email,
      password: body.password,
    };

    log.info('Criando usuario no banco de dados');
    const newUser = await service.create(userData);

    const addressData = {
      userId: newUser.id,
      street: body.street,
      number: body.number,
      district: body.district,
      complement: body.complement,
      zipCode: body.zipCode,
      city: body.city,
      state: body.street,
    };

    log.info('Criando endereço e associando o mesmo ao usuário');
    await addressService.create(addressData);

    const profileData = {
      userId: newUser.id,
    };

    log.info('Criando perfil no banco de dados');
    await profileService.create(profileData, newUser);


    log.info(`Usário ${email} cadastrado com sucesso`);
    log.info(`Enviando email de boas-vindas. userEmail=${newUser.email}`);

    await emailService.sendWelcomeEmail(newUser);

    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para obter um usuário.'
  /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/User" },
              description: 'Usuário encontrado.'
        } */
  try {
    const { userId } = req.params;

    log.info(`Iniciando busca ao usuário. userId=${userId}`);
    const user = await service.getById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    log.info(`Finalizando busca ao usuário. userId=${userId}`);

    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    const errorMsg = 'Erro ao buscar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para obter todos os usuários.'
  /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/AllUser" },
              description: 'Usuários encontrados.'
        } */
  try {
    const { query } = req;

    log.info('Iniciando busca por todos os usuarios');

    const users = await service.getAll(query);

    log.info('Finalizando busca por todos os usuarios');

    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    const errorMsg = 'Erro ao buscar todos os usuários';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const edit = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para modificar as informaçoes de um usuário.'
  /* #swagger.parameters['user'] = {
        in: 'body',
        description: 'Informações do usuário.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/AddUser" }
        } */
  /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/User" },
              description: 'Usuário modificado com sucesso.'
        } */
  try {
    const { userId } = req.params;
    const { body } = req;
    const { birthday } = body;

    log.info(`Iniciando atualização do usuário. userId=${userId}`);
    log.info('Verificando se o usuário existe');

    const existedUser = await service.getById(userId);

    if (!existedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    delete body.email;

    const bDay = moment(birthday, DATE_FORMAT).toDate();

    const userData = {
      name: body.name,
      lastname: body.lastname,
      birthday: bDay,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
    };

    log.info(`Atualizando usuario no banco de dados. userId=${userId}`);
    const user = await service.edit(userId, userData);

    const addressData = {
      userId: user.id,
      street: body.street,
      number: body.number,
      district: body.district,
      complement: body.complement,
      zipCode: body.zipCode,
      city: body.city,
      state: body.state,
    };

    log.info(`Atualizando endereço do usuário. userId=${userId}`);
    await addressService.edit(userId, addressData);

    log.info('Usário atualizado com sucesso');
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const delet = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para excluir um usuário.'
  /* #swagger.responses[200] = {
            schema: "Usuário excluido com sucesso",
            description: 'Usuário excluido.'
        } */
  try {
    const { userId } = req.params;

    log.info(`Deletando endereço do usuario. userId=${userId}`);
    await addressService.delet(userId);

    log.info(`Deletando usuario. userId=${userId}`);
    await service.delet(userId);

    log.info('Usuario deetado');

    return res.status(StatusCodes.OK).json('Usuário deletado com sucesso');
  } catch (error) {
    const errorMsg = 'Erro ao deletar usuário';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    log.info('Iniciando comportamento de recuperação de senha');
    log.info(`Buscando usuário. userEmail=${email}`);

    const user = await service.getByEmail(email);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Nenhum usuário com este email foi não encontrado' });
    }

    const forgetPasswordCode = getRandomNumber(
      FORGET_PASSWORD_CODE_MIN,
      FORGET_PASSWORD_CODE_MAX,
    );

    log.info(`Salvando codigo para recuperação de senha. userEmail=${email}`);
    await service.saveForgetPasswordCode(forgetPasswordCode, email);

    log.info(`Enviando email para o usuário. userEmail=${email}`);
    await emailService.sendForgetPasswordEmail(email, forgetPasswordCode);

    return res.status(StatusCodes.OK).json('Email enviado.');
  } catch (error) {
    const errorMsg = 'Erro ao recuperar senha.';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const changePassword = async (req, res) => {
  try {
    const { user } = req;
    const { newPassword } = req.body;

    log.info(`Iniciando atualização de senha. userEmail=${user.email}`);

    await service.changePassword(user, newPassword);

    log.info('Senha atualizada');

    return res.status(StatusCodes.OK).json('Senha atualizada');
  } catch (error) {
    const errorMsg = 'Erro ao recuperar senha.';

    log.error(errorMsg, 'app/controllers/user.controller.js', error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

module.exports = {
  create,
  getById,
  getAll,
  edit,
  delet,
  forgetPassword,
  changePassword,
};
