const httpStatus = require('http-status-codes');
const profileService = require('../services/profile.service');
const log = require('../services/log.service');

const { StatusCodes } = httpStatus;

const create = async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.description = 'Endpoint para criar um perfil.'
    /* #swagger.parameters['newProfile'] = {
          in: 'body',
          description: 'Informações do perfil.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/AddProfile" }
          } */
    /* #swagger.responses[201] = {
              schema: { $ref: "#/definitions/Profile" },
              description: 'Novo perfil criado.'
          } */
    try {
        const { body } = req;
        const { userId } = req.params;
        log.info(`Iniciando criação do perfil. userId=${userId}`);

        const profileData = {
            userId,
            socialMedia: body.socialMedia,
            description: body.description,
            privateAtConnection: body.privateAtConnection
        };

        log.info('Criando perfil no banco de dados');
        const newProfile = await profileService.create(profileData);

        return res.status(StatusCodes.CREATED).json(newProfile);
    } catch (error) {
        const errorMsg = 'Erro ao cadastrar perfil';

        log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

// const getProfileByUserId = async (req, res) => {
//   // #swagger.tags = ['Profile']
//   // #swagger.description = 'Endpoint para buscar perfil.'
//   /* #swagger.responses[200] = {
//             schema: { $ref: "#/definitions/Profile" },
//             description: 'Perfil encontrado.'
//         } */
//   try {
//     const { userId } = req.params;

//     log.info(`Iniciando busca pelo perfil. userId=${userId}`);
//     const profile = await profileService.getById(userId);

//     if (!profile) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ error: 'Nenhum perfil foi encontrado' });
//     }

//     log.info(`Finalizando busca ao perfil. userId=${userId}`);

//     return res.status(StatusCodes.OK).json(profile);
//   } catch (error) {
//     const errorMsg = 'Erro ao buscar endereço';

//     log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: `${errorMsg} ${error.message}` });
//   }
// };

const edit = async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.description = 'Endpoint para modificar um perfil.'
    /* #swagger.parameters['profile'] = {
          in: 'body',
          description: 'Informações do perfil.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/AddProfile" }
          } */
    /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/Profile" },
              description: 'Perfil editado.'
          } */
    try {
        const { userId } = req.params;
        const { body } = req;

        log.info(`Iniciando atualização do perfil. userId=${userId}`);
        log.info('Verificando se o perfil existe');

        const existedProfile = await profileService.getById(userId);

        if (!existedProfile) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Endereço não encontrado' });
        }

        const profileData = {
            userId,
            socialMedia: body.socialMedia,
            description: body.description,
            privateAtConnection: body.privateAtConnection
        };

        log.info(`Atualizando perfil no banco de dados. userId=${userId}`);
        const profile = await profileService.edit(userId, profileData);

        log.info('Perfil atualizado com sucesso');
        return res.status(StatusCodes.OK).json(profile);
    } catch (error) {
        const errorMsg = 'Erro ao atualizar perfil';

        log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

const delet = async (req, res) => {
    // #swagger.tags = ['Profile']
    // #swagger.description = 'Endpoint para exclui o perfil de um usuario.'
    /* #swagger.responses[200] = {
              schema: "Perfil excluido com sucesso",
              description: 'Perfil excluido.'
          } */

    try {
        const { userId } = req.params;

        log.info(`Deletando perfil. userId=${userId}`);
        await profileService.delet(userId);

        return res.status(StatusCodes.OK).json('Perfil deletado com sucesso');
    } catch (error) {
        const errorMsg = 'Erro ao deletar perfil';

        log.error(errorMsg, 'app/controllers/profile.controller.js', error.message);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: `${errorMsg} ${error.message}` });
    }
};

module.exports = {
    create,
    //getProfileByUserId,
    edit,
    delet,
};
