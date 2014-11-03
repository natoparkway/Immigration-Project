(function(window, document, undefined) {
	var ResultsView = {};

	ResultsView.showResults = function(correct_answers, incorrect_answers, all_questions, language) {
		$('#main-page').off("click");	//Turn off listeners from previous page
		$('#main-page').off("submit");
		createView();
	}


	function createView() {
		var request = new XMLHttpRequest();

		request.addEventListener('load', function() {
			if(request.status != 200) alert("ERROR");
			document.write(this.responseText);
		});

		request.open("GET", '/results', false);
		request.send();
	}


	window.ResultsView = ResultsView;
})(this, this.document);