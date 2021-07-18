const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/journal/queries');
const authentication = require('../helper/javascript/authentication');

//gets all pages
router.get('/', authentication.restrictUser(), async function (req, res) {
    var journal = await queries.getJournalPages(req.session.username);
    res.render('journal', {user: req.session.username, pages: journal});
});

//'create page' form
router.get('/page/create', authentication.restrictUser(), function (req, res) {
    res.render('createPage', {user: req.session.username});
});

//gets selected page
router.get('/page/:id', authentication.restrictUser(), async function(req, res) {
    var id = req.params.id;
    var page = await queries.selectPage(id);
    res.render('page', {user: req.session.username, page: page, id: id});
});

//adds page to journal database
router.post('/page/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('pageError', {user: req.session.username, location: '/journal/page/create'});
    } else {
        try {
            var user = req.session.username;
            var title = req.body.title;
            var content = req.body.content;
            await queries.createPage(user, title, content);
            res.redirect('http://localhost:3000/journal');
        } catch (error) {
            console.log(error.message);
        }
    }
});

//edits journal page content
router.post('/page/:id/edit', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    var id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('pageError', {user: req.session.username, location: '/journal/page/' + id});
    } else {
        try {
            var title = req.body.title;
            var content = req.body.content;
            await queries.editPage(title, content, id);
            res.redirect('http://localhost:3000/journal');
        } catch (error) {
            console.log(error.message);
        }
    }
});

//deletes selected journal page
router.post('/page/:id/delete', async function(req, res) {
    var id = req.params.id;
    try {
        await queries.deletePage(req.session.username, id);
        res.redirect('http://localhost:3000/journal');
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;