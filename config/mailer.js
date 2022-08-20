const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASSWORD_MAILTRAP,
    },
})

transporter.verify().then(() => {
    console.log('Listo para enviar emails')
})

module.exports = { transporter }
