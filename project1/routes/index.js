var express = require('express');
var router = express.Router();
var english_questions = require("../public/questions/english_questions.js")
var spanish_questions = require("../public/questions/spanish_questions.js");

//var questions = require("questions.js");  //use export.questions = JSON. Save as JS file
/*req.session is an object that persists throughout the session. We can use express-session middleware to put that onto a database.
 * I don't need to do anything differently
 *
 */
/* GET home page. */

router.get('/', function(req, res) {
  res.render('introduction-view.ejs');
});

//Data storage in post request
//In post its req.body
//Russell says its req.data

router.get('/english', function(req, res) {
    req.session.header = 'Citizenship Test';  //.title is already taken

    var lines = {
      line1: 'Welcome! You are about to take the exam portion of the United States Citizenship Test.',
      line2: 'The exam is 100 questions long. Right now, you may take all 100 questions, 50 questions or 20 questions.',
      line3: 'Please choose below.',
      line4: 'Or, type the number of questions you want to answer below:'
    };

    res.render('instructions-view.ejs', 
      {
          data: lines, 
          title: req.session.header
      });
});

router.get('/spanish', function(req, res) {
    req.session.header = 'Examen de Ciudadanía';

    var lines = {
      line1: 'Bienvenidos! Este es el la porción de examen del examen para la ciudadanía estadounidense.',
      line2: 'El examen es 100 preguntas. Ahora, puede elegir tomar todo, 50, o 20 preguntas.',
      line3: 'Elige abajo.',
      line4: 'O, tipa el numero de preguntas a que quiere responder:'
    };

    res.render('instructions-view.ejs',
      {
        data: lines, 
        title: req.session.header
      });
});

router.post('/spanish', function(req, res) {
  console.log(req.body);
  console.log('hi');

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
});*/


module.exports = router;
