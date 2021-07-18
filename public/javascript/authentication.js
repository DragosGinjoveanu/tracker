function restrictUser() {  
    return (req, res, next) => {
        if (req.session.loggedin == true) return next();
        res.render('loginFail', {fail: 'Please login to view this page!', location: '/user/login', error: 'You are not logged in.'});
    }
}

module.exports = {restrictUser};