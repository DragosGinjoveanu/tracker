const queries = require('../model/stats/queries');
const moment = require('moment');

async function getUserStats(name) {
    const points = await queries.getPoints(name);
    const pages = await queries.getNrJournalPages(name);
    const doneTasks = await queries.getNrTasks(name, true);
    const undoneTasks = await queries.getNrTasks(name, false);
    //progress-bar for the to-dos
    let percentage = parseInt((doneTasks * 100) / (parseInt(doneTasks) + parseInt(undoneTasks)));
    if (isNaN(percentage)) {
        percentage = 0;
    }
    const stats = {name, points, pages, doneTasks, undoneTasks, percentage};
    return stats;
}

async function getHabitData(name) {
    let days = [];
    let uncompletedHabits = [];
    let completedHabits = [];
    for (let i = 0; i <= 6; i++) {
        days[i] = moment().subtract(i, 'days').format("YYYY-MM-DD");
        completedHabits[i] = parseInt(await queries.getHabitsStatsByDate(true, days[i], name));
        uncompletedHabits[i] = parseInt(await queries.getHabitsStatsByDate(false, days[i], name));
    }
    const habits = {completedHabits, uncompletedHabits, days};
    return habits;
}

async function getTopData(users, selection) {
    let stats = [];
    let labels = [];
    for (let i = 0; i < users.length; i++) {
        stats[i] = parseInt(users[i][selection]);
        labels[i] = users[i].name;
    }
    const data = {stats, labels};
    return data;
}

module.exports = {getHabitData, getUserStats, getTopData};