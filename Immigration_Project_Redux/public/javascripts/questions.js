(function(window, document, undefined) {

/*
 * Javascript for question-view.ejs. 
 *
 * Page deals with user input of answers to questions and 
 * uses handlebars to display whether they were correct and 
 * all possible correct answers.
 */

var MIN_EDIT_DIST = 0.3;
var NUM_QUESTIONS = 100;
var isDone = false;
var language;
var $main = $('#main');
var $answer_template = $('#answer-template')
var handlebarsTemplates = {
	renderAnswerPage: Handlebars.compile($answer_template.html())
};

//Set language
language = window.location.pathname.split('/')[1];

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
 * If the server has indicated that the user has taken the allotted number of questions,
 * instead of going to a new question the method sets the URL to be that of the
 * results page.
 */
$('body').click(function(event) {
	event.preventDefault();
	if(event.target.id === "submit_answer") goToAnswerScreen();
	if(event.target.id === "nxt-btn") {
		var path = window.location.pathname.split('/');
		var next_q = Math.floor((Math.random() * NUM_QUESTIONS));

		//If done, go to results page. Else just go to a new question
		if(isDone) window.location.href = "/" + language + "/results"
		else window.location.href = "/" + path[1] + "/questions/" + path[3] + "/" + next_q;
	}
	
});

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

		createAnswerScreen(isCorrect, response, answers, language);
	});
}

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

	$.post("/" + language + "/" + id + "/" + correct, function(resposne){});

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
	if(language === 'spanish' && !isCorrect) description = "no es correcta.";
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


})(this, this.document);	