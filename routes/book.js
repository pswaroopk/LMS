var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Book = orm.models.book;
  Book.find()
  .populate('authors')
  .then(function (books) {
    if (!books || books.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(books.slice(100, 200));
  })
  .catch(next)
});

// usuage
// localhost:3000/book/search?q=The Res
router.get('/search', function(req, res, next) {
  var query = req.query.q;
  var Book = orm.models.book;
  Book.find({
      or: [
        { isbn: { 'contains': query } },
        { title: { 'contains': query } }
      ]
  })
  .populate('authors')
  .then(function (books) {
    if (!books || books.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(books);
  })
  .catch(next)
});

// just for testing
router.post('/', function(req, res, next){
  var Book = orm.models.book;
  Book.findOrCreate({ book: req.body.isbn }, {
    isbn: req.body.isbn,
    title: req.body.title,
    authors: req.body.authors
  })
  .then(function foundOrCreated(book) {
    return res.status(201).json(book);
  })
  .catch(next)
});

module.exports = router;
