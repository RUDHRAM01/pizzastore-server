const express = require('express')

const router = express.Router()


const pool = require('../db/Db')


// Get all ingredients
router.get('/', (req, res) => {
    pool.query('SELECT * FROM ingredients ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

module.exports = router;