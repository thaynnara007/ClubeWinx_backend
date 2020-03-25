const user = require('./services/user/user.router');

module.exports = (app) => {
    app.use('/user', user);
}