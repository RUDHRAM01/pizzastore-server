const express = require('express')
const router = express.Router()

const pool = require('../db/Db')

// Get all users
router.get('/', (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Get user by id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Create a new user
router.post('/', (req, res) => {
    const { fname, lname, email, password, phone, address } = req.body;

    pool.query('INSERT INTO users (fname, lname, email, password, phone, address) VALUES ($1, $2, $3, $4, $5, $6)', [fname, lname, email, password, phone, address], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`User added with ID: ${results.insertId}`)
    })
})

// Update user
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { fname, lname, email, password, phone, address } = req.body

    pool.query(
        'UPDATE users SET fname = $1, lname = $2, email = $3, password = $4, phone = $5, address = $6 WHERE id = $7',
        [fname, lname, email, password, phone, address, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`User modified with ID: ${id}`)
        }
    )
});

// Delete user
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
})

module.exports = router