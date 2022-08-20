const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL_NODEMAIL,
        pass: process.env.PASSWORD_CONFIG_APP_GMAIL,
    },
})

transporter.verify().then(() => {
    console.log('Listo para enviar emails')
})

module.exports = { transporter }
