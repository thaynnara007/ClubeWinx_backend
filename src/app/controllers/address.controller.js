const httpStatus = require('http-status-codes');
const addressService = require('../services/address.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
    try {
        const { body } = req;
        const { userId } = req.params;
        log.info(`Iniciando criação de endereço. userId=${userId}`);

        
        const addressData = {
            userId: userId,
            street: body.street,
            number: body.number,
            district: body.district,
            complement: body.complement,
            zipCode: body.zipCode,
            city: body.city,
            state: body.state,
        };

        log.info('Criando endereço no banco de dados');
        const newAdress = await addressService.create(addressData);

        return res.status(StatusCodes.CREATED).json(newAdress);
    } catch (error) {
        const errorMsg = 'Erro ao cadastrar endereço';

        log.error(errorMsg, 'app/controllers/address.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

const getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        log.info(`Iniciando busca pelo endereço. userId=${userId}`);
        const adress = await addressService.getByUserId(userId);

        if (!adress) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Nenhum endereço foi encontrado' });
        }

        log.info(`Finalizando busca ao endereço. userId=${userId}`);

        return res.status(StatusCodes.OK).json(adress);
    } catch (error) {
        const errorMsg = 'Erro ao buscar endereço';

        log.error(errorMsg, 'app/controllers/address.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

const getAll = async (req, res) => {
    try {
        const { query } = req;

        log.info('Iniciando busca por todos os endereços');

        const allAddress = await addressService.getAll(query);

        log.info('Finalizando busca por todos os endereço');

        return res.status(StatusCodes.OK).json(allAddress);
    } catch (error) {
        const errorMsg = 'Erro ao buscar todos os endereços';

        log.error(errorMsg, 'app/controllers/user.address.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

const edit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { body } = req;


        log.info(`Iniciando atualização do endereço do usuário. userId=${userId}`);
        log.info('Verificando se o endereço existe');

        const existedAddress = await addressService.getByUserId(userId);

        if (!existedAddress) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Endereço não encontrado' });
        }

        const addressData = {
            street: body.street,
            number: body.number,
            district: body.district,
            complement: body.complement,
            zipCode: body.zipCode,
            city: body.city,
            state: body.state,
        };

        log.info(`Atualizando endereço no banco de dados. userId=${userId}`);
        const address = await addressService.edit(userId, addressData);

        log.info('Endereço atualizado com sucesso');
        return res.status(StatusCodes.OK).json(address);
    } catch (error) {
        const errorMsg = 'Erro ao atualizar endereço';

        log.error(errorMsg, 'app/controllers/address.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

const delet = async (req, res) => {
    try {
        const { userId } = req.params;

        log.info(`Deletando endereço. userId=${userId}`);
        await addressService.delet(userId);

        return res.status(StatusCodes.OK).json('Endereço deletado com sucesso');
    } catch (error) {
        const errorMsg = 'Erro ao deletar endereço';

        log.error(errorMsg, 'app/controllers/address.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

module.exports = {
    create,
    getByUserId,
    getAll,
    edit,
    delet,
};
