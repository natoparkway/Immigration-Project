(function(window, document, undefined) {

	function addTestSpecificationsListeners(language) {
		$('#main-page').click(function(event) {
			if(event.target.nodeName != 'BUTTON') {
				event.preventDefault();
				return;
			} else {
				var numQuestions = event.target.firstChild.nodeValue;
				TestTakingView.startTest(numQuestions, language);
			}
		});

		$('#main-page').submit(function(event) {
			event.preventDefault();
			if(event.target.id === 'numquestions') {
				var numQuestions = $(event.target).find('[name="number"]').val();
				//Implement not a number functionality
				TestTakingView.startTest(numQuestions, language);
			}
		});
	}

})(this, this.document);