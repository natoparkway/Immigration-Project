(function(window, document, undefined) {

getUserAnswers();

function getUserAnswers() {
	//Try to get answers from local storage
	// if("answers" in localStorage) {
	// 	console.log("In local");
	// 	createResultsDisplay(localStorage.getItem("answers"));
	// 	return;
	// }
	//Post request to get question data
	$.get('/results/answers', function(data) {
		//localStorage.setItem("answers", JSON.stringify(data.answers));
		createResultsDisplay(data.answers);
	});
}

function createResultsDisplay(answers) {
	answers = [];
	answers.push({
		question: "Hello",
		response: "World",
		correct: true
	});
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

	addListeners(answers);

}

function addListeners(answers) {
	var language = window.location.href.split('/')[3];
	$("body").click(function(event) {
		console.log(event.target);
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
			$('.modal-body').text(youAnsweredText + answers[id].response);
			
			//If answer was not correct, list correct answers
			if(!correct) {
				var text = language === 'english' ? "Correct answers were: " : "Respuestas correctas incluyen: ";
				$correctAnswers = $('<h4></h4>').text(text);
				//Add all correct answers and some text: Doesn't work
				$('.modal-content').append($correctAnswers);
			}
		}

	});
}





})(this, this.document);