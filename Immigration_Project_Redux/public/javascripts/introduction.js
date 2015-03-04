(function(window, document, undefined) {

var DEFAULT_QUESTIONS = 10;
var NUM_QUESTIONS = 100;

addTestSpecificationsListeners();

function addTestSpecificationsListeners() {
	$('#instructions').click(function(event) {
		event.preventDefault();
		if(event.target.nodeName === 'BUTTON') {
			var numQuestions;

			//If input form button was hit
			if(isNaN(event.target.firstChild.nodeValue)) {
				var numQuestions = $('#num-questions-form').val();
				if(isNaN(numQuestions)) numQuestions = DEFAULT_QUESTIONS;
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