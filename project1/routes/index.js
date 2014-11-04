var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  console.log('/');
  res.render('introduction-view.ejs');
});


router.get('/english', function(req, res) {
    //console.log(req.query);
    res.render('instructions-view.ejs', {data: req.query});
    console.log('/english');
});


/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

/*

//Res is what is sent to client as acknowledgement
//Req is the url encoded object sent in the post request
router.post("/user", function(req, res) {
  var name = req.params.name;
  var bio = req.params.bio;

  var user = new mongoose.User();
  user.name = name;
  user.bio = bio;
  user.save;

  var user = mongoose.find(user.id)
  user.bio = "some modified descrioption"
  user.save
});

*/

module.exports = router;
