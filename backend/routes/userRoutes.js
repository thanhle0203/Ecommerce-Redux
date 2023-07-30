const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const router = express.Router()

// User registration route
router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
],

async(req, res) => {
    // Create a new user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user)
            return res.status(400).json({ errors: [{ msg: 'User already exists'}]})

        user = new User({
            name, 
            email,
            password: await bcrypt.hash(password, 8)
        })

        await user.save()

        res.send('User registered')
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// User login route
router.post (
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array })
        }

        const { email, password } = req.body

        try {
            let user = await User.findOne({ email })

            if (!user)
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials '}]})

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials '}]})
            }

            res.send('User logged in')
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

router.get('/', async (req, res) => {
    // Get all users
})


module.exports = router