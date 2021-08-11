function checkHabitLabels(req) {
    const label = req.body.label;
    if ((label.length == 0 && req.body.checked == undefined) || (req.body.checked != undefined && label.length != 0)) {
        return false;
    }
    return true;
}

module.exports = {checkHabitLabels};