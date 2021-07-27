const queries = require('../model/habits/queries');

async function addHabitStats(user, habits) {
    for (let i = 0; i < habits.length; i++) {
        const id = habits[i].id;
        const done = await queries.getHabitStatus(user, id, true);
        const undone = await queries.getHabitStatus(user, id, false);
        habits[i].done = done;
        habits[i].undone = undone;
    }
    return habits;
}

module.exports = {addHabitStats}