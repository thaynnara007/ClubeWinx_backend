const httpStatus = require('http-status-codes');
const log = require('../services/log.service');
const service = require('../services/category.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Endpoint para criar uma categoria.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.parameters['newCategory'] = {
        in: 'body',
        description: 'Informações de categoria.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/NewCategory" }
        } */
  /* #swagger.responses[201] = {
            schema: { $ref: "#/definitions/Category" },
            description: 'Nova categoria criada.'
        } */
  try {
    const { body } = req;

    log.info('Inicializando criação da categoria');

    if (!body.name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Um nome para a categoria é obrigatório' });
    }

    const existedCategory = await service.getByName(body.name);

    if (existedCategory) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ erro: 'Uma categoria com esse nome já existe' });
    }

    log.info('Criando categoria no banco de dados');
    const newCategory = await service.create(body);

    log.info('Categoria criada com sucesso');

    return res.status(StatusCodes.CREATED).json(newCategory);
  } catch (error) {
    const errorMsg = 'Erro ao cadastrar categoria';

    log.error(
      errorMsg,
      'app/controllers/category.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getById = async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Endpoint para buscar uma categoria.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.responses[201] = {
            schema: { $ref: "#/definitions/Category" },
            description: 'Categoria encontrada.'
        } */
  try {
    const { categoryId } = req.params;

    log.info(`Iniciando busca pela categoria. categoryId=${categoryId}`);
    log.info(
      `Buscando a categoria no banco de dados. categoryId=${categoryId}`,
    );

    const category = await service.getById(categoryId);

    if (!categoryId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Categoria não encontrada' });
    }

    log.info('Busca concluida com sucesso');

    return res.status(StatusCodes.OK).json(category);
  } catch (error) {
    const errorMsg = 'Erro ao buscar categoria';

    log.error(
      errorMsg,
      'app/controllers/category.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const getAll = async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Endpoint para criar uma categoria.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.responses[201] = {
            schema: { $ref: "#/definitions/Categories" },
            description: 'Nova categoria criada.'
        } */
  try {
    const { query } = req;

    log.info('Iniciando busca por todas as categorias');
    log.info('Buscando categorias no banco de dados');
    const categories = await service.getAll(query);

    log.info('Finalizando busca a todas as categorias');

    return res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    const errorMsg = 'Erro ao buscar todas as categoria';

    log.error(
      errorMsg,
      'app/controllers/category.controller.js',
      error.message,
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `${errorMsg} ${error.message}` });
  }
};

const edit = async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Endpoint para modificar uma categoria.'
  // #swagger.security = [{ 'Bearer': [] }]
  /* #swagger.parameters['newCategory'] = {
        in: 'body',
        description: 'Informações de categoria.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/NewCategory" }
        } */
  /* #swagger.responses[201] = {
            schema: { $ref: "#/definitions/Category" },
            description: 'Categoria modificada.'
        } */
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    log.info(`Iniciando atualização da categoria. categoryId=${categoryId}`);
    const existedCategory = await service.getByName(name);

    if (existedCategory) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Já existe uma categoria com esse nome' });
    }

    log.info(
      `Atualizando a categoria no banco de dados. categoryId=${categoryId}`,
    );
    const category = await service.edit(categoryId, req.body);

    log.info('Atualização realizada com sucesso');

    return res.status(StatusCodes.OK).json(category);
  } catch (error) {
    const errorMsg = 'Erro ao atualizar categoria';

    log.error(
      errorMsg,
      'app/controllers/category.controller.js',
      error.message,
    );

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
};
