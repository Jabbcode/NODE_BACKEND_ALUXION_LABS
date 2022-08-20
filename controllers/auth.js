const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { transporter } = require('../config/mailer')
const { generarJWT } = require('../helpers/jwt')
const User = require('../models/User')

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const userDB = await User.findOne({ email })

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña Invalidos',
            })
        }

        const validPassword = bcrypt.compareSync(password, userDB.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña Invalidos',
            })
        }

        const token = await generarJWT(userDB.id, userDB.username)

        res.json({
            ok: true,
            user: {
                uid: userDB.id,
                username: userDB.username,
                token,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
        })
    }
}

const register = async (req, res) => {
    const { email, password } = req.body

    try {
        const userDB = await User.findOne({ email })

        if (userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo electronico ya esta en uso',
            })
        }

        newUser = new User(req.body)

        const salt = bcrypt.genSaltSync()
        newUser.password = bcrypt.hashSync(password, salt)

        await newUser.save()

        const token = await generarJWT(newUser.id, newUser.username)

        res.status(201).json({
            ok: true,
            user: {
                username: newUser.username,
                email: newUser.email,
                token,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
        })
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res
            .status(400)
            .json({ ok: false, msg: 'El username es requerido' })
    }

    const msg = 'Revise su correo y entre al link para recuperar su contraseña'
    let emailStatus = 'Ok'

    try {
        let userDB = await User.findOne({ email })

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Algo malo ha ocurrido',
            })
        }
        const token = await generarJWT(userDB.id, userDB.username)

        let verificationLink = `http://localhost:5000/new-password/${token}`

        userDB.resetToken = token

        await transporter.sendMail({
            from: 'Forget Password - Sistema de archivos',
            to: userDB.email,
            subject: 'Forget Password',
            html: `
            <b>Porfavor clique en el siguiente enlace o copielo y peguelo en su navegador para terminar el proceso</b>
            <a href="${verificationLink}">${verificationLink}<a/>
            `,
        })

        await userDB.save()

        return res.json({
            ok: true,
            info: emailStatus,
            msg,
        })
    } catch (error) {
        emailStatus = error
        res.status(400).json({
            ok: false,
            msg,
        })
    }
}

const newPassword = async (req, res) => {
    const { newPassword } = req.body
    const resetToken = req.headers['reset']
    const SECRET_JWT = process.env.SECRET_JWT

    if (!(resetToken && newPassword)) {
        return res.status(400).json({
            ok: false,
            msg: 'Todos los campos son requeridos',
        })
    }

    try {
        const { uid } = jwt.verify(resetToken, SECRET_JWT)

        const userDB = await User.findOne({ uid })

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Algo no ha ido bien',
            })
        }

        const salt = bcrypt.genSaltSync()
        userDB.password = bcrypt.hashSync(newPassword, salt)

        await userDB.save()

        res.status(200).json({
            ok: true,
            msg: 'Contraseña cambiada correctamente',
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok: false,
            msg: 'Algo no ha ido bien',
        })
    }
}

module.exports = {
    login,
    register,
    forgetPassword,
    newPassword,
}
