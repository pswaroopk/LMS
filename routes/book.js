var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Book = orm.models.book;
  Book.find()
  .then(function (books) {
    if (!books || books.length === 0) return res.json({
      message: 'No books found'
    })
    return res.json(books);
  })
  .catch(next)
});

router.post('/', function(req, res){

});

module.exports = router;
