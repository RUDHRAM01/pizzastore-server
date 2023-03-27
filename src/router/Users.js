const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const pool = require('../db/Db')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
//Sign in

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    pool.query('Select * from users where email = $1', [email], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length > 0) {
            const user = results.rows[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    throw err
                }
                if (result) {
                    const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET);
                    res.status(200).json({ result: user, token })
                } else {
                    res.status(401).json({ message: 'Password is incorrect' })
                }
            })
        } else {
            res.status(401).json({ message: 'User does not exist' })
        }
    })
})


// Get all users
router.get('/', auth, (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Get user by id
router.get('/:id', auth, (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Create a new user
router.post('/register', async (req, res) => {
    const { fname, lname, email, password, phone, address } = req.body;
    pool.query('Select * from users where email = $1', [email], async (error, results) => {
        if (error) {
            res.status(400).send(error)
        }
        if (results.rows.length > 0) {
            res.status(400).send('User already exists')
        }else{
            const hashPass = await bcrypt.hash(password, 10);
            pool.query('INSERT INTO users (fname, lname, email, password, phone, address) VALUES ($1, $2, $3, $4, $5, $6)', [fname, lname, email, hashPass, phone, address], (error, results) => {
                if (error) {
                    res.status(400).send(error)
                    return
                }
                const token = jwt.sign({ id: results.id }, process.env.JWT_SECRET);
                res.status(201).send({user : results.id, token: token})
            })
        }

    })
})

// Update user
router.put('/:id', auth, (req, res) => {
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
router.delete('/:id', auth, (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
})

module.exports = router