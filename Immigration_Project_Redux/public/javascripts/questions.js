/*
 * Javascript for question-view.ejs. 
 *
 * Page deals with user input of answers to questions and 
 * uses handlebars to display whether they were correct and 
 * all possible correct answers.
 */

var MIN_EDIT_DIST = 0.3;
var NUM_QUESTIONS = 100;
var ENTER_KEY_CODE = 13;
var JARO_WINKLER_CORRECT = 0.85;
var JARO_WINKLER_CLOSE = 0.75;
var isDone = false;
var language;
var usedQuestions = []
var $main = $('#main');
var $answer_template = $('#answer-template')
var handlebarsTemplates = {
	renderAnswerPage: Handlebars.compile($answer_template.html())
};

//Set language
language = window.location.pathname.split('/')[1];

/*
 * If the user hits enter while '#nxt-btn' is on the screen, go to
 * the next screen.
 */
$('body').bind('keydown', function(event) {
	if(event.keyCode === ENTER_KEY_CODE) {
		if($('#nxt-btn').length) goToNextQuestion();
	}
})

/*
 * If the user hits enter, go to the answer screen (if there is text in the 
 * submission box).
 */ 
$('body').submit(function(event) {
	event.preventDefault();
	goToAnswerScreen();
})

/*
 * If the user hits the 'submit' button go the answer screen (if there is
 * text in the submission box).
 *
 * If the user hits the 'next' button, serve up a new question.
 */
$('body').click(function(event) {
	event.preventDefault();
	if(event.target.id === "finish-btn") window.location.href = '/' + language + '/results';
	if(event.target.id === "submit_answer") goToAnswerScreen();
	if(event.target.id === "nxt-btn") goToNextQuestion();
	
});

/* 
 * Serves up a new question page.
 *
 * If the server has indicated that the user has taken the allotted number of questions,
 * instead of going to a new question the method sets the URL to be that of the
 * results page. 
 */
function goToNextQuestion() {
	var path = window.location.pathname.split('/');
	var next_q = Math.floor((Math.random() * NUM_QUESTIONS)) + 1;

	//We want a new, unique question
	while(usedQuestions.indexOf(next_q) != -1) {
		next_q = Math.floor((Math.random() * NUM_QUESTIONS)) + 1;
	}

	//If done, go to results page. Else just go to a new question
	if(isDone) window.location.href = "/" + language + "/results"
	else window.location.href = "/" + path[1] + "/questions/" + path[3] + "/" + next_q;
}

/*
 * Creates an answer screen to the given question and renders it on screen
 * using handlebars.
 */
function goToAnswerScreen() {
	var id = window.location.pathname.split('/')[4];
	var numQuestions = window.location.pathname.split('/')[3];

	var response = $('#answer_input').val();
	if(response === "") return;
	$.post("/" + language + "/" + numQuestions + "/" + id + "/" + response, function(data) {
		isDone = data.isDone;	//Set isDone flag if we have answered the allotted number of questions

		var answers = data.answers;
		var alternatives = data.alternatives;
		var isCorrect = checkCorrectness(answers, alternatives, response, id);
		//var isClose = checkCorrectnessByJaroWinkler(answers.concat(alternatives), response);

		createAnswerScreen(isCorrect, response, answers, language);
	});
}

// function checkCorrectnessByJaroWinkler(all_answers, response) {
// 	var isClose = false;
// 	var isCorrect = false;

// 	response = response.replace(/\s+/g, '');	//Removes all spaces

// 	all_answers.forEach(function(answer) {
// 		answer = answer.replace(/\s+/g, '');
// 		var jaroWinkler = natural.JaroWinklerDistance(answer, response);
//    		console.log(jaroWinkler);
// 		if(jaroWinkler > JARO_WINKLER_CLOSE) isClose = true;
// 	});
//   return isClose;
// }

/*
 * Checks the correctness of a given question using edit distance.
 * Posts whether the question was answered or correctly or not to the
 * server for later use.
 */
function checkCorrectness(answers, alternatives, response, id) {
	var correct = false;
	var all_answers = answers.concat(alternatives);
	all_answers.forEach(function(answer) {
		var edit_dist = new Levenshtein(answer.toLowerCase(), response.toLowerCase());
		if(edit_dist / answer.length < MIN_EDIT_DIST) correct = true;
	});


	$.post("/" + language + "/" + id + "/" + correct, function(response){
		usedQuestions = response["usedQuestions"]

	});

	return correct;
}


/*
 * Creates the answer screen (which displays whether the user was correct)
 * and what other correct answers there were using handlebars.
 */
function createAnswerScreen(isCorrect, response, answers, language) {
	//Get text strings correct for each language.
	var description = "es correcta!";
	var next_str = "Proixima Pregunta"
	var correct_answers_description = "Respuestas correctas incluyen";
	if(language === 'spanish'){
		if(!isCorrect) description = "no es correcta.";
	} 
	
	if(language === 'english') {
		description = "is incorrect.";
		next_str = "Next Question";
		correct_answers_description = "Correct answers include";
		if(isCorrect) description = "is correct!";
	}

	//Put in in an object for use in the handlebars template
	var answer_object = {
		description: description,
		answer: response,
		all_answers: answers,
		next: next_str,
		correct_answers_description: correct_answers_description
	}

	var answer_page_html = handlebarsTemplates.renderAnswerPage(answer_object);
	$main.html(answer_page_html);
}

/*
 * Displays instructions in a modal
 *
 */
function displayInstructions() {

}
