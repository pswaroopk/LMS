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
  var branch = req.query.branch || '-1';
  var Book = orm.models.book;
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 20;


  var isbn = req.query.isbn || '';
  var title = req.query.title || '';
  var author = req.query.author || '';
  var type = req.query.type || 'or';


  if (query) {
    isbn = title = author = query;
  }


  Book.query({
    text: "SELECT b.isbn, b.title, \
      string_agg(DISTINCT a.name, ', ') as author, \
      string_agg(DISTINCT (CASE WHEN bl.bookcopy IS NULL THEN 'AVAILABLE' ELSE 'NOT AVAILABLE' END), ',') as availability  \
      FROM bookauthor ba \
      JOIN author a ON ba.author = a.id \
      JOIN book b ON b.isbn = ba.book \
      JOIN bookcopy bc ON bc.isbn = b.isbn \
      LEFT JOIN bookloan bl ON bl.bookcopy = bc.id \
      WHERE ($4 = '-1' OR bc.branchid IN ($4)) AND (a.name ILIKE  $3 " + type + " b.title ILIKE  $2  " + type + "  b.isbn ILIKE $1) \
      GROUP BY b.isbn, b.title",
    values: ['%' + isbn + '%', '%' + title + '%','%' + author + '%', branch]
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
