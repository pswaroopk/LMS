var express = require('express');
var router = express.Router();
var orm = require('../orm');

//get fines
router.get('/', function(req, res, next) {
  var fine = orm.models.fine;
  fine.find()
  .then(function (fines) {
    if (!fines || fines.length === 0) return res.json({
      message: 'No outstanding fines found'
    })
    return res.json(fines);
  })
  .catch(next)
});

// usuage
// localhost:3000/book/search?q=The Res
router.get('/:cardno', function(req, res) {
  var cardno = req.params.cardno;
  var Fine = orm.models.fine;
  Fine.query({
    text: "SELECT b.title, bl.duedate, bl.datein, bl.dateout, fineamount, paid, f.id AS fineid\
      FROM fine f \
      JOIN bookloan bl ON bl.id = f.bookloan \
      JOIN bookcopy bc ON bc.id = bl.bookcopy \
      JOIN book b ON b.isbn = bc.isbn \
      WHERE bl.cardno = $1",
    values: [cardno]
  }, function (err, queryResults) {
    if (err)
      return res.status(500).json({
        error: err,
        message: 'some unexpected error'
      })
    if (!queryResults || queryResults.rows.length === 0) return res.json({
      message: 'No fines found'
    })
    return res.json({
      fines: queryResults.rows
    });
  });
});

//DROP entry once full payment is done... how to handle that

// To update fineamount once partial/ full payment is done - USE ONLY IF REQUIRED
router.put('/:fineid', function(req, res, next){
  var fine = orm.models.fine;
  fine.update({ id: req.params.fineid }, {
    paid: true
  })
  .then(function updated(updatedFine) {
    return updatedFine.query({
      text: "SELECT b.title, bl.duedate, bl.datein, bl.dateout, fineamount, paid, f.id AS fineid\
        FROM fine f \
        JOIN bookloan bl ON bl.id = f.bookloan \
        JOIN bookcopy bc ON bc.id = bl.bookcopy \
        JOIN book b ON b.isbn = bc.isbn \
        WHERE bl.cardno = $1",
      values: [cardno]
    }, function (err, queryResults) {
      if (err)
        return res.status(500).json({
          error: err,
          message: 'some unexpected error'
        })
      if (!queryResults || queryResults.rows.length === 0) return res.json({
        message: 'No fines found'
      })
      return res.json(queryResults.rows);
    });
  })
  .catch(next)
});

module.exports = router;
