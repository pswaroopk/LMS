var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Author = orm.models.author;
  Author.find()
  .then(function (authors) {
    if (!authors || authors.length === 0) return res.json({
      message: 'No authors found'
    })
    return res.json(authors);
  })
  .catch(next)
});

// just for testing
router.post('/', function(req, res, next){
  var Author = orm.models.author;
  Author.findOrCreate({ isbn: req.body.isbn }, {
    isbn: req.body.isbn,
    title: req.body.title
  })
  .then(function foundOrCreated(author) {
    return res.status(201).json(author);
  })
  .catch(next)
});

module.exports = router;
