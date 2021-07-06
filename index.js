const express = require('express');
const app = express();
const port = 3000;
const user = require('./controller/user');
const tracker = require('./controller/tracker');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', [
  path.join(__dirname, 'views/tracker'),
  path.join(__dirname, 'views/login'),
]);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/user', user);
app.use('/', tracker);