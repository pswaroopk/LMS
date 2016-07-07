var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var Author = orm.models.author;
  Author.find()
  .populate('books')
  .then(function (authors) {
    if (!authors || authors.length === 0) return res.json({
      message: 'No authors found'
    })
    return res.json(authors.slice(0, 10));
  })
  .catch(next)
});


// usuage
// localhost:3000/author/search?q=Rowling
router.get('/search', function(req, res, next) {
  var query = req.query.q;
  var author = orm.models.author;
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 20;
  author.find({ name: { 'contains': query } })
  .skip(skip)
  .limit(20)
  .populate('books')
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
  Author.findOrCreate({ name: req.body.name }, {
    name: req.body.name
  })
  .then(function foundOrCreated(author) {
    return res.status(201).json(author);
  })
  .catch(next)
});

module.exports = router;
