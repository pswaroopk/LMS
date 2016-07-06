var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  return res.json({
    message: 'hello'
  })
});

router.post('/', function(req, res){

});

module.exports = router;
