const nodemailer = require('nodemailer');
const { EMAIL } = require('../../config/environment');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL.email,
    pass: EMAIL.password,
  },
});

const sendForgetPasswordEmail = async (sendTo, forgetPasswordCode) => {
  const mailOptions = {
    from: EMAIL.email,
    to: sendTo,
    subject: 'Código para recuperação de senha',
    text: `Seu código é: ${forgetPasswordCode}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendForgetPasswordEmail,
};
