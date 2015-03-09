(function(window, document, undefined) {

getUserAnswers();

function getUserAnswers() {
	var language = window.location.href.split('/')[3];
	$.get('/' + language + '/results/answers', function(data) {
		createResultsDisplay(data.answers, data.all_questions);
	});
}

function createResultsDisplay(answers, questions) {
	// answers = [];
	// answers.push({
	// 	question: "Hello",
	// 	response: "World",
	// 	correct: true
	// });
	// answers.push({
	// 	question: "Goodbye",
	// 	response: "Moon",
	// 	correct: false
	// });

	$resultsList = $('.list-group');
	if(!answers) answers = [];
	for(var i = 0; i < answers.length; i++) {
		if(!answers[i]) continue;	//Do nothing if question has not been asnwered

		$result = $('<button></button>')
					.attr('class', 'btn result-btn')
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

function addListeners(answers, questions) {
	var language = window.location.href.split('/')[3];
	$("body").click(function(event) {
		if(event.target.id === 'return-to-start') {
			window.location.href = "/";
			return;
		}

		if(event.target.className === 'btn result-btn') {
			var id = parseInt($(event.target).text());
			var correct = answers[id].correct;

			//Get correct english or spanish text
			var correctText = correct ? "Correct!" : "Incorrect";
			var youAnsweredText = language === 'english' ? "You answered: " : "Su respuesta era: ";
			if(language === 'spanish') correctText = correct ? "Correcto!" : "Incorrecto";

			$('.modal-title').text(correctText);
			$('#their-answers').text(youAnsweredText + answers[id].response);
			
			//If answer was not correct, list correct answers
			createModal(language, questions[id].answers);
		}

	});
}

function createModal(language, correct_answers) {
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