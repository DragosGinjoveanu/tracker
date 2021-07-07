const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/user/queries');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async function(req, res) {
    var name = req.body.user;
    var password = req.body.password;
    try {
        const user = await queries.selectUser(name);
        if (user.password == password) {
            console.log(name +' logged in.');
            link = 'http://localhost:3000/' + name;
            res.redirect(link);
        } else {
            res.render('loginFail', {fail: 'Login failed!', location: '/user/login', error: 'Wrong password/username.'});
        }
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
            var user = req.body.user;
            var password = req.body.password;
            queries.newUser(user, password);
            console.log('Account created.\nUsername: ' + user +', Password: '+ password);
            res.redirect('http://localhost:3000/user/login');
        } catch (error) {
            console.log('User already exists.');
            res.render('loginFail', {fail: 'Registration failed!', location: '/user/register', error: 'Username already exists.'});
        }
    }
});

module.exports = router;