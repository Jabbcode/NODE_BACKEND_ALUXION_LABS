const jwt = require('jsonwebtoken')
const SECRET_JWT = process.env.SECRET_JWT

const validarJWT = (req, res, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No se envio ningun token',
        })
    }

    try {
        const { uid, username } = jwt.verify(token, SECRET_JWT)

        req.uid = uid
        req.username = username
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido',
        })
    }

    next()
}

module.exports = {
    validarJWT,
}
