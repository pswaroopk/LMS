var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Book = orm.models.book;
  Book.find()
  .populate('author')
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
  Book.findOrCreate({ isbn: req.body.isbn }, {
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author
  })
  .then(function foundOrCreated(book) {
    return res.status(201).json(book);
  })
  .catch(next)
});

module.exports = router;
