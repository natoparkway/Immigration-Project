(function(window, document, undefined) {

/*
 * Javascript for spanish-into.ejs and english-intro.ejs. 
 *
 * Adds button listeners to the screen that detect which button has
 * been pressed (the button indicates how many questions the user
 * would like to take).
 * 
 * Then sets URL to the next page, question-view.
 */

var DEFAULT_QUESTIONS = 10;
var NUM_QUESTIONS = 100;

addTestSpecificationsListeners();

//Add listeners 
function addTestSpecificationsListeners() {
	$('#instructions').click(function(event) {
		event.preventDefault();
		if(event.target.nodeName === 'BUTTON') {
			var numQuestions;

			//If input form button was hit
			if(isNaN(event.target.firstChild.nodeValue)) {
				var numQuestions = $('#num-questions-form').val();
				if(isNaN(numQuestions) || numQuestions === "") numQuestions = DEFAULT_QUESTIONS;
			} else var numQuestions = event.target.firstChild.nodeValue;

			serveTest(numQuestions);
		}
	});
}

function serveTest(numQuestions) {
	var firstQuestion = Math.floor((Math.random() * NUM_QUESTIONS));
	window.location.href = document.URL + "/questions/" + numQuestions + "/" + firstQuestion;
}



})(this, this.document);	