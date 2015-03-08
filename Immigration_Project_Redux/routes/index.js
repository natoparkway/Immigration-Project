var express = require('express');
var router = express.Router();

//Get questions data
var english_questions;
var spanish_questions;

var fs = require('fs');
fs.readFile('data/english-questions.json', 'utf8', function (error, data) {
	if(error) throw error;
	english_questions = JSON.parse(data);
});

fs.readFile('data/spanish-questions.json', 'utf8', function (error, data) {
	if(error) throw error;
	spanish_questions = JSON.parse(data);
});


/* GET home page. */
router.get('/', function(req, res) {
	req.session.header = "Citizenship Test";
	req.session.qcount = 0;
	req.session.answers = new Array(100);
  res.render('main-page.ejs');
});

router.get('/:language', function(req, res) {
	if(req.params.language === 'favicon.ico') {res.end(); return;};

	var language = req.params.language;
	console.log("Language", language)
	if(language === 'english') {
		req.session.header = "Citizenship Exam";
		res.render('english-intro.ejs');
	} else {
		req.session.header = "Examen de Ciudadania";
		res.render('spanish-intro.ejs');
	}
});

router.get('/:language/questions/:num_questions/:id', function(req, res) {
	req.session.qcount++;	//Increment how many questions we've seen
	var all_questions = spanish_questions;
	if(req.params.language === 'english') all_questions = english_questions;

	var id = req.params.id;
	var question = {
		title: req.session.header,
		number: id,
		text: all_questions[id].question,
		language: req.params.language
	};

	res.render('question-view.ejs', {data: question});
});

router.post('/:language/:num_questions/:id/:answer', function(req, res) {
	var all_questions = spanish_questions;
	if(req.params.language === 'english') all_questions = english_questions;
	
	var id = req.params.id;
	var answer = req.params.answer;

	if(!req.session.answers) req.session.answers = new Array(100);
	req.session.answers[id] = {
		response: answer,
		correct: false,
		question: all_questions[id].question
	};

	var done = req.session.qcount == req.params.num_questions;

	res.send({
		answers: all_questions[id].answers.concat(all_questions[id].alternatives),
		isDone: done
	});

});

router.post('/:language/:id/:isCorrect', function(req, res) { 
	var all_questions = spanish_questions;
	if(req.params.language === 'english') all_questions = english_questions;
	
	var id = req.params.id;
	var isCorrect = req.params.isCorrect === 'true';

	req.session.answers[id].correct = isCorrect;

	res.end();
});

router.get('/results/answers', function(req, res) {
	res.send({answers: req.session.answers});
});

router.get("/:language/results", function(req, res) {
	var info = {
		language: req.params.language
	};
	console.log(req.params.language);

	res.render("results-view.ejs", {data: info});
});
	

module.exports = router;
