const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const user = require('./controller/user');
const tracker = require('./controller/tracker');
const journal = require('./controller/journal');
const todos = require('./controller/todos');
const stats = require('./controller/stats');

//problem: Failed to prune sessions: relation "session" does not exist
app.use(session({
	store: new (require('connect-pg-simple')(session))({
    conString: 'postgres://postgres:password@localhost:5432/tracker_database'
  }),
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', [
  path.join(__dirname, 'views/tracker'),
  path.join(__dirname, 'views/login'),
  path.join(__dirname, 'views/journal'),
  path.join(__dirname, 'views/todos'),
  path.join(__dirname, 'views/stats')
]);

//app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', tracker);
app.use('/user', user);
app.use('/journal', journal);
app.use('/todos', todos);
app.use('/stats', stats);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});