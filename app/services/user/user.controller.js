const repository = require('./user.repository');
const constants = require('../../utils/constants');

exports.create = async (req, res) => {
    const user = await repository.create(req.body);

    if (user[1]) res.status(constants.CREATED).send(user);
    else res.status(constants.BAD_REQUEST).json("An user with the same data already exists");
}

exports.findAll = async (req, res) => {
    const users = await repository.findAll();

    if (users) res.status(constants.OK_STATUS).send(users);
    else res.status(constants.NO_CONTENT).json('There is not any user');
}

exports.findById = async (req, res) => {
    const id = req.params.id;
    const user = await repository.findById(id);

    if (user) res.status(constants.OK_STATUS).send(user);
    else res.status(constants.NOT_FOUND).json("User not found while search for its id");
}

exports.update = async (req, res) => {
    const userId = req.params.id;
    let user = await repository.findById(userId);

    if (!user) res.status(constants.NOT_FOUND).json("User not found for update it");
    else {
        user = await repository.update(user, req.body);

        if (user) res.status(constants.OK_STATUS).send(user);
        else res.status(constants.Internal_Server_Error).json("Something got wrong while trying to update an user");  
    }
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    let user = await repository.findById(id);

    if (!user) res.status(constants.NOT_FOUND).json('user not found for delete it');
    else{
        repository.delete(user);
        res.status(constants.OK_STATUS).json('User deleted')
    }
}