var express = require('express');
var router = express.Router();
var orm = require('../orm');
var _ = require('lodash');
router.get('/check', function(req, res, next) {
  var bookcopy = orm.models.bookcopy;
  var isbn = req.body.isbn;
  var cardno = req.body.cardno;
  var branch = req.body.branch;
  bookcopy.find({
    cardno: cardno,
    isbn: isbn,
    branchid: branch
  })
  .then(function (bookcopys) {
    if (!bookcopys || bookcopys.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(bookcopys);
  })
  .catch(next);
});

router.post('/checkout', function(req, res, next){
  var isbn = req.body.isbn;
  var cardno = req.body.cardno;
  var branch = req.body.branch;
  var today = new Date();
  var bookloan = orm.models.bookloan;
  bookcopy.find({
    cardno: cardno
  })
  .then(function found(bookcopies) {
    if (bookcopies && bookcopies.length >= 3) {
      return res.status(400).json({
        error: true,
        message: 'Book loan limit exceeded'
      });
    }
    var dueBooks = _.filter(bookcopies, function (copy) { return (new Date(createdAt) > today); })
    if (dueBooks && dueBooks.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'You have some book due book. Please check in those and continue'
      });
    }
    return res.status(201).json(bookcopy);
  })
  .catch(next)
});

router.post('/checkin', function(req, res, next){
  var bookcopy = orm.models.bookcopy;
  bookcopy.find({ bookId: req.body.bookId })
  .then(function foundOrCreated(bookcopy) {
    return res.status(201).json(bookcopy);
  })
  .catch(next)
});

module.exports = router;
