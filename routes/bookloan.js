var express = require('express');
var router = express.Router();
var orm = require('../orm');
var _ = require('lodash');
router.get('/checkout/', function(req, res, next) {
  var bookloan = orm.models.bookloan;
  var cardno = req.query.cardno;
  var branch = req.query.branch;
  bookloan.find({
    cardno: cardno,
    datein: null,
  })
  .populate('bookcopy')
  .then(function (lentBooks) {
    var branchSpecificBooks = _.filter(lentBooks, function(book) {
      return book.bookcopy.branchid == branch;
    })
    if (!branchSpecificBooks || branchSpecificBooks.length === 0) return res.json({
      message: 'No books found in the selected branch'
    })
    return res.json(branchSpecificBooks);
  })
  .catch(next);
});

router.post('/checkout', function(req, res, next){
  var isbn = req.body.isbn;
  var cardno = req.body.cardno;
  var branch = req.body.branch;
  var today = new Date();
  var loanPeriod = 14;
  var bookloan = orm.models.bookloan;
  bookloan.find({
    cardno: cardno,
    datein: null
  })
  .then(function found(bookslent) {
    if (bookslent && bookslent.length >= 3) {
      return res.status(400).json({
        error: true,
        message: 'Book loan limit exceeded'
      });
    }
    var dueBooks = _.filter(bookslent, function (book) { return (new Date(book.duedate) < today); })
    if (dueBooks && dueBooks.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'You have some due book. Please check in those and continue'
      });
    }
    return orm.models.bookcopy.query({
      text: "SELECT DISTINCT bc.id \
        FROM bookcopy bc \
        LEFT JOIN bookloan bl ON bl.bookcopy = bc.id \
        WHERE bc.branchid = $1 AND isbn = $2 \
            AND (bl.bookcopy IS NULL OR (bl.datein IS NOT NULL AND bl.datein < (current_date))) ",
      values: [branch, isbn]
    }, function (err, queryResults){
        if (err) {
          return res.status(500).json({
            error: err,
            message: 'some unexpected error occurred'
          });
        }
        if (queryResults && queryResults.rows && queryResults.rows.length > 0) {
          var book = queryResults.rows[0];
          var duedate = today.setDate(today.getDate() + loanPeriod);
          return orm.models.bookloan.create({
            cardno: cardno,
            bookcopy: book.id,
            dateout: new Date(),
            duedate: new Date(duedate)
          }).exec(function (err, model) {
            if (err) {
              return res.status(500).json({
                error: err,
                message: 'some unexpected error occurred'
              });
            }
            return orm.models.bookloan.find({
              cardno: cardno,
              datein: null
            })
            .populate('bookcopy')
            .then(function (models) {
              var branchSpecificBooks = _.filter(models, function(book) {
                return book.bookcopy.branchid == branch;
              })
              if (!branchSpecificBooks || branchSpecificBooks.length === 0) return res.json({
                message: 'No books found in the selected branch'
              })
              return res.status(200).json(branchSpecificBooks);
            });

          });
        } else {
          return res.status(404).json({
            message: 'Sorry, Book is not available for checkout in the requested branch.'
          });
        }

    })
  })
  .catch(next)
});

router.post('/checkin', function(req, res, next){
  var bookloan = orm.models.bookloan;
  var branch = req.body.branch;
  bookloan.update({
    id: req.body.loanid,
    cardno: req.body.cardno
  }, {
    datein: new Date()
  })
  .then(function updated(book) {
    return orm.models.fine
    .updateFine(book[0])
    .then(function(records) {
      return bookloan.find({
        cardno: req.body.cardno,
        datein: null
      })
      .populate('bookcopy')
      .then(function (lentBooks) {
        lentBooks = _.filter(lentBooks, function(book) {
                return book.bookcopy.branchid == branch;
              })
        if (!lentBooks || lentBooks.length === 0) return res.json({
          message: 'No books found',
          books: []
        })
        return res.json({
          books: lentBooks
        });
      });
    })

  })
  .catch(next)
});

module.exports = router;
