require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { dbConnection } = require('./config/database')

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

dbConnection()

app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
    console.log(`API corriendo en el puerto ${PORT}`)
})
