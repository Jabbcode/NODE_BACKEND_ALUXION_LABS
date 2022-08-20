const jwt = require('jsonwebtoken')
const SECRET_JWT = process.env.SECRET_JWT
const TIME_TOKEN = process.env.TIME_TOKEN

const generarJWT = (uid, username) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, username }

        jwt.sign(
            payload,
            SECRET_JWT,
            { expiresIn: TIME_TOKEN },
            (err, token) => {
                if (err) {
                    console.log(err)
                    reject('No se pudo generar el token')
                }
                resolve(token)
            }
        )
    })
}

module.exports = {
    generarJWT,
}
