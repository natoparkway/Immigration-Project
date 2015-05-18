var express = require('express');
var router = express.Router();

//Get questions data
var english_questions;
var spanish_questions;

var seen_questions = [];

//Get questions data and store them in global variables.
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

//Gets introduction page in each language, respectively
router.get('/:language', function(req, res) {
	//This is for ignoring favicon requests.
	if(req.params.language === 'favicon.ico') {res.end(); return;};

	//Render introduction
	var language = req.params.language;
	if(language === 'english') {
		req.session.header = "Citizenship Exam";
		res.render('english-intro.ejs');
	} else {
		req.session.header = "Examen de Ciudadania";
		res.render('spanish-intro.ejs');
	}
});

//Renders a page with a quetion and a form to submit your response
//Handlebars takes care of transation to whether you were correct.
router.get('/:language/questions/:num_questions/:id', function(req, res) {
	req.session.qcount++;	//Increment how many questions we've seen
	var all_questions = req.params.language === 'english' ? english_questions : spanish_questions;
	var id = parseInt(req.params.id);
	var question = {
		title: req.session.header,
		number: id,
		text: all_questions[id - 1].question,	//Subtract 1 for proper indexing
		language: req.params.language
	};

	res.render('question-view.ejs', {data: question});
});

//Posts information about the user's answer for later use.
//Stores it in req.session.answers
router.post('/:language/:num_questions/:id/:answer', function(req, res) {
	seen_questions.push(parseInt(req.params.id));
	var all_questions = req.params.language === 'english' ? english_questions : spanish_questions;
	var id = parseInt(req.params.id) - 1;	//Subtract 1 to account by off by one errors
	var answer = req.params.answer;

	if(!req.session.answers) req.session.answers = new Array(100);	//In case the user starts on this page without going to start.
	req.session.answers[id] = {
		response: answer,
		correct: false,
		question: all_questions[id].question
	};

	var done = req.session.qcount >= req.params.num_questions;

	res.send({
		answers: all_questions[id].answers,
		alternatives: all_questions[id].alternatives,
		isDone: done
	});

});

//Posts information about the user got the answer correct or not
router.post('/:language/:id/:isCorrect', function(req, res) { 
	var all_questions = req.params.language === 'english' ? english_questions : spanish_questions;

	var id = parseInt(req.params.id) - 1;	//Indexed at 0
	var isCorrect = req.params.isCorrect === 'true';

	req.session.answers[id].correct = isCorrect;

	res.send({usedQuestions: seen_questions});
});

//Sends users answered question data
router.get('/:language/results/answers', function(req, res) {
	var all_questions = req.params.language === 'english' ? english_questions : spanish_questions;
	res.send({answers: req.session.answers, all_questions: all_questions});
});

//Renders results page
router.get("/:language/results", function(req, res) {
	var info = {
		language: req.params.language
	};

	res.render("results-view.ejs", {data: info});
});
	

module.exports = router;
