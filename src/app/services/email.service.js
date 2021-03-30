const nodemailer = require('nodemailer');
const { EMAIL } = require('../../config/environment');
const welcomeTemplate = require('../email/welcomeTemplate');
const { capitalizeFirstLetter } = require('./util.service');
const forgetPasswordTemplate = require('../email/forgetPasswordTemplate');

const transporter = nodemailer.createTransport({
  host: EMAIL.smtp,
  port: EMAIL.port,
  secure: false,
  service: 'gmail',
  auth: {
    user: EMAIL.email,
    pass: EMAIL.password,
  },
});

const sendWelcomeEmail = async (user) => {
  const html = welcomeTemplate.makeEmail({
    name: capitalizeFirstLetter(user.name),
  });

  const mailOptions = {
    from: EMAIL.email,
    to: user.email,
    subject: 'Bem-vindo ao Homemate',
    html,
  };

  await transporter.sendMail(mailOptions);
};

const sendForgetPasswordEmail = async (sendTo, forgetPasswordCode) => {
  const html = forgetPasswordTemplate.makeEmail(forgetPasswordCode);

  const mailOptions = {
    from: EMAIL.email,
    to: sendTo,
    subject: 'Código para recuperação de senha',
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendForgetPasswordEmail,
};
