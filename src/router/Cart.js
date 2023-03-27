const express = require('express');
const router = express.Router();
const pool = require('../db/Db');
const auth = require('../middleware/auth');
// Get all cart
router.get('/', auth, (req, res) => {
    pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
        if (error) {
            res.status(401).json(error)
        }
        res.status(200).json(results.rows)
    })
})

// Get cart by id
router.get('/:id', auth, (req, res) => {
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
    let { userId, data } = req.body;

    let k = JSON.stringify(data)
    pool.query('SELECT * FROM cart WHERE id = $1', [userId], (error, results) => {
        if (error) {
            console.log(error)
        }
        if (results.rows.length === 0) {
            pool.query('INSERT INTO cart (id, data) VALUES ($1, $2)', [userId, k], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(201).send(`Cart added with ID: ${results.id}`)
            })
        } else {
            pool.query('UPDATE cart SET data = $1 WHERE id = $2',[k,userId],(error, results) => {
                    if (error) {
                        throw error
                    }
                    res.status(200).send(`Cart updated with ID: ${userId}`)
                }
            )
        }
    })

})


// Delete cart
router.delete('/:id', auth, (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM cart WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Cart deleted with ID: ${id}`)
    })
});


module.exports = router;