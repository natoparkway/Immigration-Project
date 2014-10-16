(function(window, document, undefined) {
	
	var TestTakingView = {};
	var testQuestions;

	TestTakingView.startTest = function(num_questions, language) {
		console.log(num_questions);

		createQuestionsArray(language);

		return;
	};

	function createQuestionsArray(language) {
		var file;
		if(language === 'english') file = "/questions/english_questions.JSON";
		else file = "/questions/spanish_questions.JSON";
		
		var fileRequest = new XMLHttpRequest();

		fileRequest.addEventListener('load', function() {
			console.log(fileRequest.status);
			var array = jQuery.parseJSON(fileRequest.responseText);
			console.log(array[1]);
			
		});

		fileRequest.open("GET", file, false);
		fileRequest.send();

	}







	window.TestTakingView = TestTakingView;
})(this, this.document);
