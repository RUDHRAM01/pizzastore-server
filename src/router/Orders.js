const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/Db');


// Get all orders
router.get('/', auth, (req, res) => {
    pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})


// Get order by id
router.get('/:id',auth, (req, res) => {
    const id = parseInt(req.params.id)


    pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})


// Create a new order
router.post('/', auth, (req, res) => {
    const { id, cart } = req.body
    let k = JSON.stringify(cart)

    pool.query('INSERT INTO orders (id, name) VALUES ($1, $2)', [id, k], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Order added with ID: ${results.id}`)
    }
    )
})


// Delete order

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Order deleted with ID: ${id}`)
    }
    )
})

module.exports = router;
