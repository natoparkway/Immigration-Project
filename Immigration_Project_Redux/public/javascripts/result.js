(function(window, document, undefined) {


/*
 * Javascript of results-view.ejs.
 *
 * Puts correct text into modals when buttons are clicked and adds 
 * listeners that allow said buttons to work.
 */
getUserAnswers();

/*
 * Gets all of the users answers from the server and creates a 
 * display of them.
 */
function getUserAnswers() {
	var language = window.location.href.split('/')[3];
	$.get('/' + language + '/results/answers', function(data) {
		createResultsDisplay(data.answers, data.all_questions);
	});
}

/*
 * For each non-null answer (aka the user has actually interacted with them)
 * the method creates a line on the screen
 */
function createResultsDisplay(answers, questions) {
	$resultsList = $('.list-group');
	if(!answers) answers = [];
	for(var i = 0; i < answers.length; i++) {
		if(!answers[i]) continue;	//Do nothing if question has not been asnwered
		var correctClass = answers[i].correct ? 'correct' : 'incorrect';

		$result = $('<button></button>')
					.attr('class', 'btn result-btn ' + correctClass)
					.attr('type', 'button')
					.attr('data-toggle', 'modal')
					.attr('data-target', '#myModal')
					.text(i + ") " + answers[i].question);

		$('<li></li>')
		.attr('class', 'list-group-item')
		.html($result)
		.appendTo($resultsList);
	}

	addListeners(answers, questions);

}

/*
 * Adds listeners for when the 'return-to-start' button is clicked
 * and when a button that will activate a modal is clicked.
 */
function addListeners(answers, questions) {
	var language = window.location.href.split('/')[3];
	$("body").click(function(event) {
		if(event.target.id === 'return-to-start') {
			window.location.href = "/";
			return;
		}

		//Class also contains whether the answer was correct so we use indexOf
		if(event.target.className.indexOf('btn result-btn') !== -1) {
			var id = parseInt($(event.target).text());
			var correct = answers[id].correct;
			
			//If answer was not correct, list correct answers
			createModal(language, questions[id].answers, answers, correct, id);
		}

	});
}

/*
 * When a button is clicked, puts answer information into the modal.
 */
function createModal(language, correct_answers, answers, correct, id) {
	//Get correct english or spanish text for the modal title and some text
	var correctText = correct ? "Correct!" : "Incorrect";
	var youAnsweredText = language === 'english' ? "You answered: " : "Su respuesta era: ";
	if(language === 'spanish') correctText = correct ? "Correcto!" : "Incorrecto";

	$('.modal-title').text(correctText);
	$('#their-answers').text(youAnsweredText + answers[id].response);

	//List correct answers
	var text = language === 'english' ? "Correct answers were: " : "Respuestas correctas incluyen: ";
	$correctAnswers = $('<h4></h4>')
										.text(text)
										.attr('id', 'correct-answers-label');
										
	$('#all-answers').html($correctAnswers);
	correct_answers.forEach(function(answer) {
		$('<li></li>')
		.text(answer)
		.appendTo($('#all-answers'));
	})
}





})(this, this.document);