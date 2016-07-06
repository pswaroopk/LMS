var express = require('express');
var router = express.Router();
var orm = require('../orm');

router.get('/', function(req, res, next) {
  var libraryBranch = orm.models.librarybranch;
  libraryBranch.find()
  .populate('bookcopies')
  .then(function (branches) {
    if (!branches || branches.length === 0) return res.json({
      message: 'No branches found'
    })
    return res.json(branches);
  })
  .catch(next)
});

// just for testing
router.post('/', function(req, res, next){
  var libraryBranch = orm.models.librarybranch;
  libraryBranch.findOrCreate({ branchid: req.body.branchid }, {
    branchid: req.body.branchid,
    address: req.body.address,
    name: req.body.name
  })
  .then(function foundOrCreated(librarybranch) {
    return res.status(201).json(librarybranch);
  })
  .catch(next)
});

module.exports = router;
