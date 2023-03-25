const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const Users = require('./router/Users')

app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use('/users', Users)

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

