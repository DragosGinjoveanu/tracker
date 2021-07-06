const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../model/database')

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async function(req, res) {
    var user = req.params.user;
    var password = req.params.password;
    try {
        const a = await pool.query('SELECT name AS name, password AS password FROM users WHERE name = $1', [user]);
        // if password = password - redirectionare home page
        console.log(a);
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/register', body('user').isLength({ min: 3 }), body('password').isLength({ min: 5 }), async function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('loginFail', {fail: 'Registration failed!', location: '/user/register', error: 'Please enter valid username/password.'});
        console.log(errors);
    } else {
        try {
            var password = req.body.password;
            var user = req.body.user;
            const paste = await pool.query("INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *", [user, password]);
            console.log('Account created.\nUsername: ' + user +', Password: '+ password);
            res.redirect('http://localhost:3000/user/login');
        } catch (error) {
            console.log('User already exists.');
            res.render('loginFail', {fail: 'Registration failed!', location: '/user/register', error: 'Username already exists.'});
        }
    }
});

module.exports = router;
