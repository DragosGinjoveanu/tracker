const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');

const user = require('./controller/user');
const tracker = require('./controller/tracker');
const journal = require('./controller/journal');
const tasks = require('./controller/tasks');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', [
  path.join(__dirname, 'views/tracker'),
  path.join(__dirname, 'views/login'),
  path.join(__dirname, 'views/journal'),
  path.join(__dirname, 'views/tasks')
]);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/', tracker);
app.use('/user', user);
app.use('/journal', journal);
app.use('/tasks', tasks);