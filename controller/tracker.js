const express = require('express');
const router = express.Router();

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    res.render('tracker');
});

//home route for each user after logging in
router.get('/home', function (req, res) {
    if (req.session.loggedin) {
		res.render('home', {user: req.session.username});
	} else {
        res.render('loginFail', {fail: 'Please login to view this page!', location: '/user/login', error: 'You are not logged in.'});
	}
});

module.exports = router;