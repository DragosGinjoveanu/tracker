const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('tracker');
});

router.get('/home', function (req, res) {
    if (req.session.loggedin) {
		res.render('home', {user: req.session.username});
	} else {
        res.render('loginFail', {fail: 'Please login to view this page!', location: '/user/login', error: 'You are not logged in.'});
	}
});

module.exports = router;