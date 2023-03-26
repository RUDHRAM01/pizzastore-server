const express = require('express');
const router = express.Router();

const pool = require('../db/Db');

// Get all cart
router.get('/', (req, res) => {
    pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Get cart by id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM cart WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Create a new cart
router.post('/', (req, res) => {
    const { userId, ingredientsId, quantity } = req.body;

    pool.query('INSERT INTO cart (userId, ingredientsId, quantity) VALUES ($1, $2, $3)', [userId, ingredientsId, quantity], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Cart added with ID: ${results.insertId}`)
    })
})


// Delete cart
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM cart WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Cart deleted with ID: ${id}`)
    })
});


module.exports = router;