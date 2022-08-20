const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        const DB_URI = process.env.DB_URI
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('DB Online')
    } catch (error) {
        console.log(error)
        throw new Error('Problema de conexion con DB')
    }
}

module.exports = { dbConnection }
