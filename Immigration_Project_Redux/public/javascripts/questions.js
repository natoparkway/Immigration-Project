(function(window, document, undefined) {

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

$('body').submit(function(event) {
	event.preventDefault();
	goToAnswerScreen();
})

$('body').click(function(event) {
	event.preventDefault();
	if(event.target.id === "submit_answer") goToAnswerScreen();
	if(event.target.id === "nxt-btn") {
		var path = window.location.pathname.split('/');
		var next_q = Math.floor((Math.random() * NUM_QUESTIONS));
		if(isDone) window.location.href = "/" + language + "/results"
		else window.location.href = "/" + path[1] + "/questions/" + path[3] + "/" + next_q;
	}
	
});

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

function checkCorrectness(answers, alternatives, response, id) {
	var correct = false;
	answers.concat(alternatives).forEach(function(answer) {
		var edit_dist = new Levenshtein(answer.toLowerCase(), response.toLowerCase());
		if(edit_dist / answer.length < MIN_EDIT_DIST) correct = true;
	});

	$.post("/" + language + "/" + id + "/" + correct, function(resposne){});

	return correct;
}

function createAnswerScreen(isCorrect, response, answers, language) {
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