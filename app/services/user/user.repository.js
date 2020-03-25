const {User} = require('../../startup/db');

exports.create = async (userInfo) => {
    const user = await User.findOrCreate({
        where:{
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email
        }
    })
    return user;
}

exports.findAll = async () => {
    const users = await User.findAll({
        attributes: [
            'id',
            'firstName',
            'lastName',
            'email'
        ]
    })
    return users;
}

exports.findById = async (id) => {
    const user = await User.findByPk(id);

    return user;
}

exports.update = async (user, userInfo) => {
    const newUser = await user.update({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        updatedAt: new Date()
    })

    return newUser;
}

exports.delete = async (user) =>{
    user.destroy();
}