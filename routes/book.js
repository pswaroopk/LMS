var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Book = orm.models.book;
  Book.find()
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
router.get('/search', function(req, res, next) {
  // var isbn;
  // var title;
  // var author;
  // var querBuilder = {
  //   or: []
  // };
  // if (req.query.isbn) {
  //   queryBuilder.or.push({
  //     isbn: { contains: req.query.isbn }
  //   });
  // }
  // if (req.query.title) {
  //   queryBuilder.or.push({ title: { contains: req.query.isbn } });
  // }
  var query = req.query.q;
  var Book = orm.models.book;
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 20;
  Book.find({
      or: [
        { isbn: { 'contains': query } },
        { title: { 'contains': query } }
      ]
  })
  .skip(skip)
  .limit(limit)
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
