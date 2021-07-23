const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/javascript/authentication');

//for adding habit from list
router.post('/create/:name', async function(req, res) {
    console.log(req.params.name);
});

module.exports = router;