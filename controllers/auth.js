const bcrypt = require('bcryptjs')
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

        // const token = await generarJWT(userDB.id, userDB.name)

        res.json({
            ok: true,
            user: {
                uid: userDB.id,
                name: userDB.name,
                // token,
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

        // const token = await generarJWT(newUser.id, newUser.name)

        res.status(201).json({
            ok: true,
            user: {
                name: newUser.name,
                email: newUser.email,
                // token,
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

const forgetPassword = (req, res) => {}

module.exports = {
    login,
    register,
    forgetPassword,
}
