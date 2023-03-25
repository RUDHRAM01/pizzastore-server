const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3000

app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
    
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

