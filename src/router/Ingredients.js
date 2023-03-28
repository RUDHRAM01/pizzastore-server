const express = require('express')
const router = express.Router()
const pool = require('../db/Db')
const auth = require('../middleware/auth')

// Get all ingredients
router.get('/', auth, (req, res) => {
    pool.query('SELECT * FROM ingredients ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// post ingredient

router.post('/', auth, (req, res) => {
    const { name } = req.body

    const k = JSON.stringify(name)

    pool.query('INSERT INTO ingredients (name) VALUES ($1)', [k], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Ingredient added with ID: ${results.id}`)
    })
})


module.exports = router;