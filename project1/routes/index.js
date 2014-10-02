var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('./HTML/' + 'index.html');
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

//GET Userlist page.
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection'); //the collection we want to use
  collection.find({}, {}, function(e,docs) {
    res.render('userlist', {
      "userlist" : docs
    });
  });
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
