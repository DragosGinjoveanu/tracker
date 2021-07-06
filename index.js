const express = require('express');
const app = express();
const port = 3000;
const user = require('./controller/user');
const bodyParser = require('body-parser');

app.set('view engine', 'pug');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/user', user);