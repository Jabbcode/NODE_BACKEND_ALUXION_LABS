const { Router } = require('express')
const { check } = require('express-validator')
const { login, register, forgetPassword, newPassword } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const router = Router()

router.post(
    '/login',
    [
        check('email', 'El correo electronico es obligatorio').isEmail(),
        check('password', 'la contraseña es obligatoria').not().isEmpty(),
        check(
            'password',
            'La constraseña debe contener minimo 6 caracteres'
        ).isLength(6),
        validarCampos,
    ],
    login
)

router.post(
    '/register',
    [
        check('username', 'El username es obligatorio').not().isEmpty(),
        check('email', 'El correo electronico es obligatorio').isEmail(),
        check('password', 'la contraseña es obligatoria').not().isEmpty(),
        check(
            'password',
            'La constraseña debe contener minimo 6 caracteres'
        ).isLength(6),
        validarCampos,
    ],
    register
)

router.put('/forget-password', validarCampos, forgetPassword)

router.put('/new-password', validarCampos, newPassword)

module.exports = router
