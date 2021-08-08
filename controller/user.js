const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/user/queries');
const authentication = require('../helper/authentication');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', authentication.restrictUser(), (req, res) => {
    req.session.destroy();
    res.redirect('http://localhost:3000/');
});

router.post('/login', async function(req, res) {
    var name = req.body.user;
    var password = req.body.password;
    try {
        const user = await queries.selectUser(name);
        if (user.password == password) {
            console.log(name +' logged in.');
            req.session.loggedin = true;
            req.session.username = name;
            res.redirect('http://localhost:3000/home');
        } else {
            res.render('loginFail', {fail: 'Login failed!', location: '/user/login', error: 'Wrong password.'});
        }
    } catch (error) {
        res.render('loginFail', {fail: 'Login failed!', location: '/user/login', error: 'Invalid username.'});
    }
});

router.post('/register', body('user').isLength({ min: 3 }), body('password').isLength({ min: 5 }), async function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('loginFail', {fail: 'Registration failed!', location: '/user/register', error: 'Please enter valid username/password.'});
    } else {
        try {
            var user = req.body.user;
            var password = req.body.password;
            await queries.newUser(user, password);
            console.log('Account created.\nUsername: ' + user +', Password: '+ password);
            res.redirect('http://localhost:3000/user/login');
        } catch (error) {
            res.render('loginFail', {fail: 'Registration failed!', location: '/user/register', error: 'Username already exists.'});
        }
    }
});

router.post('/delete', async function(req, res) {
    var name = req.session.username;
    await queries.deleteUser(name);
    req.session.destroy();
    console.log('Account deleted. Name: ' + name);
    res.redirect('http://localhost:3000/');
});

module.exports = router;