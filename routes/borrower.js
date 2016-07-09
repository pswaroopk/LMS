var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var borrower = orm.models.borrower;
  borrower.find()
  .then(function (borrowers) {
    if (!borrowers || borrowers.length === 0) return res.json({
      message: 'No borrowers found'
    })
    return res.json(borrowers);
  })
  .catch(next)
});

// To update borrowers information - USE ONLY IF REQUIRED
router.put('/:cardNo', function(req, res, next){
  var borrower = orm.models.borrower;
  borrower.update({ cardNo: req.params.cardNo }, {
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    phone: req.body.phone
  })
  .then(function updated(borrower) {
    return res.status(201).json(borrower);
  })
  .catch(next)
});

// just for testing
router.post('/', function(req, res, next){
  var borrower = orm.models.borrower;
  borrower.findOne({
    cardno: req.body.cardno
  })
  .then(function found(model) {
    if (model) return res.json({
      message: 'Card number already taken by some one.',
      data: model
    })
    return borrower.create({
      cardno: req.body.cardno
    }, {
      cardno: req.body.cardno,
      ssn: req.body.ssn,
      fname: req.body.fname,
      lname: req.body.lname,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      phone: req.body.phone,
    })
    .then(function created(borrower) {
      return res.status(201).json({
        message: 'Created successfully',
        data: borrower
      });
    })
  })
  .catch(next)
});

module.exports = router;
