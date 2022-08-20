const { validationResult } = require('express-validator')

const validarCampos = (req, res, next) => {
    const { errors } = validationResult(req)

    if (errors.length > 0) {
        return res.status(401).json({
            ok: false,
            errors,
        })
    }

    next()
}

module.exports = {
    validarCampos,
}
