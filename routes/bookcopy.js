var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var bookcopy = orm.models.bookcopy;
  bookcopy.find()
  .populate(['isbn', 'librarybranch'])
  .then(function (bookcopys) {
    if (!bookcopys || bookcopys.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(bookcopys);
  })
  .catch(next)
});

// just for testing
router.post('/', function(req, res, next){
  var bookcopy = orm.models.bookcopy;
  bookcopy.findOrCreate({ bookId: req.body.bookId }, {
    bookId: req.body.bookId,
    isbn: req.body.isbn,
    librarybranch: req.body.librarybranch
  })
  .then(function foundOrCreated(bookcopy) {
    return res.status(201).json(bookcopy);
  })
  .catch(next)
});

module.exports = router;
