const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/journal/queries');
const authentication = require('../helper/authentication');
const random = require('../helper/random.js');

//gets all pages
router.get('/', authentication.restrictUser(), async function (req, res) {
    const journal = await queries.getJournalPages(req.session.username);
    res.render('journal', {user: req.session.username, pages: journal});
});

//'create page' form
router.get('/page/create', authentication.restrictUser(), function (req, res) {
    res.render('createPage', {user: req.session.username});
});

//gets selected page
router.get('/page/:id', authentication.restrictUser(), async function(req, res) {
    const id = req.params.id;
    const page = await queries.selectPage(id);
    res.render('page', {user: req.session.username, page: page, id: id});
});

//adds page to journal database
router.post('/page/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorImage = random.randomImage();
        res.render('error', {user: req.session.username, location: '/journal/page/create', message: 'Please complete all the fields!', image: errorImage});
    } else {
        const user = req.session.username;
        const title = req.body.title;
        const content = req.body.content;
        await queries.createPage(user, title, content);
        res.redirect('http://localhost:3000/journal');
    }
});

//edits journal page content
router.post('/page/:id/edit', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorImage = random.randomImage();
        res.render('error', {user: req.session.username, location: '/journal/page/' + id, message: 'Please complete all the fields!', image: errorImage});
    } else {
        const title = req.body.title;
        const content = req.body.content;
        await queries.editPage(title, content, id);
        res.redirect('http://localhost:3000/journal');
    }
});

//deletes selected journal page
router.post('/page/:id/delete', async function(req, res) {
    const id = req.params.id;
    await queries.deletePage(req.session.username, id);
    res.redirect('http://localhost:3000/journal');
});

module.exports = router;