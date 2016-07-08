var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Book = orm.models.book;
  Book.find()
  // .limit(100)
  .populate('authors')
  .limit(50)
  .then(function (books) {
    if (!books || books.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(books);
  })
  .catch(next)
});

// usuage
// localhost:3000/book/search?q=The Res
router.get('/search', function(req, res) {
  var query = req.query.q;
  var Book = orm.models.book;
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 20;

  Book.query({
    text: "SELECT b.isbn, b.title, a.name as author \
      FROM bookauthor ba \
      JOIN author a ON ba.author = a.id \
      JOIN book b ON b.isbn = ba.book \
      WHERE (a.name LIKE  $1 OR b.title LIKE  $1 OR b.isbn LIKE $1)",
    values: ['%' + query + '%']
  }, function (err, queryResults) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'some unexpected error'
      })
    if (!queryResults || queryResults.rows.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(queryResults.rows);
  });
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
