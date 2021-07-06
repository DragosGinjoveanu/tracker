const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// create, view all, view single, edit, delete journal page

//'create page' form
router.get('/create/:user', function (req, res) {
    res.render('createPage', {username: req.params.user});
});

//adds page to journal database
router.post('/create/:user', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    // trb lucrat, + fila separata queries
    if (!errors.isEmpty()) {
        res.render('formError', {location: ''});
    } else {
        try {
            var author = req.body.author;
            var description = req.body.description;
            queries.createPaste(author, description);
            res.redirect('http://localhost:3000/pastesList');
        } catch (error) {
            console.log(error.message);
        }
    }
});

//gets all pages
router.get('/pages/:user', async function (req, res) {
    var pastes = await queries.pastesList();
    res.render('pastesList', {pastes: pastes});
});

router.get('/pastes/:id', async function(req, res) {
    var id = req.params.id;
    var paste = await queries.selectPaste(id);
    res.render('editPaste', {paste: paste, id: id});
});

//edits paste's content
router.post('/edit/:id', body('author').isLength({ min: 1 }), body('description').isLength({ min: 1 }), async function(req, res) {
    var id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('formError', {location: '/pastes/' + id});
    } else {
        try {
            var author = req.body.author;
            var description = req.body.description;
            queries.editPaste(author, description, id);
            res.redirect('http://localhost:3000/pastesList');
        } catch (error) {
            console.log(error.message);
        }
    }
});

//deletes selected paste
router.post('/delete/:id', async function(req, res) {
    var id = req.params.id;
    try {
        queries.deletePaste(id);
        res.redirect('http://localhost:3000/pastesList');
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;