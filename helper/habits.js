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

const images = ['writing.png', 'diet.png', 'workingOut.png', 'sleep.png', 'offline.png', 'hygene.png'];
const titles = ['Journaling', 'Eating Healthy', 'Working Out', 'Sleeping Well', 'Going Offline', 'Practicing personal hygiene']
const descriptions = [
    'Commit to writing daily. Set aside the time. Start small.',
    'Read labels. Reduce fat and sugar. Eat lots of fruit and vegetables.',
    'Start slowly and build up. Use proper form. Breathe. Listen to your body.',
    'Stick to a sleep schedule. Set aside eight hours for sleep. Reduce blue light exposure in the evening.',
    'Go offline for a moment. Challange yourself and see how much time you can resist.',
    'Wash hands frequently, bathe & brush teeth regularly, wear clean clothes. Shine like a star.'
];

module.exports = {addHabitStats, images, titles, descriptions}