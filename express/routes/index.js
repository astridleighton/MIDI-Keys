var express = require('express');
var router = express.Router();

var database = require('../app/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test-login', function(req, res, next)
{
  var username = request.body.username;
  var password = request.body.password;

  if (username && password)
  {
    
  }
})

module.exports = router;