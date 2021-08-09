function checkHabitLabels(label, user, errorImage, habit, req, res) {
    if (label.length == 0 && req.body.checked == undefined) {
        return res.render('error', {user: user, message: 'Please add a label', location: '/habits/' + habit + '/create', method: 'POST', image: errorImage});
    } else if (req.body.checked != undefined && label.length != 0) {
        return res.render('error', {user: user, message: 'Please remove the label or uncheck the box', location: '/habits/' + habit + '/create', method: 'POST', image: errorImage}); 
    } 
    return false;
}

module.exports = {checkHabitLabels};