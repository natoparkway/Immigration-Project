(function(window, document, undefined) {
	
	var EDIT_DIST_RATIO = 0.3;
	var TestTakingView = {};
	var $question_template = $('#question-template');
	var $answer_template = $('#answer-template')
	var $main = $('#main-page');
	var handlebarsTemplates = {
		renderQuestion: Handlebars.compile($question_template.html()),
		renderAnswerPage: Handlebars.compile($answer_template.html())
	};

	var taken_questions = [];
	var count;
	var questions_array;
	var current_question_index;
	var language;

	//Handlebars helper. Context is the array, options is the handlebars function.
	Handlebars.registerHelper('each', function(context, options) {
  		var ret = "";

  		for(var i=0, j=context.length; i<j; i++) {
	    	ret = ret + options.fn(context[i]);
	  	}

  		return ret;
	});

/*
 * Starts the test taking process. 
 * First gets the array of questions and answers from a JSON file.
 * Then calls takeTest, which takes care of test taking process.
 *
 */
	TestTakingView.startTest = function(num_questions, chosen_language) {
		$main.off("click");	//Take off the click listener from the previous view
		questions_array = createQuestionsArray(chosen_language);
		count = num_questions;
		language = chosen_language;
		beginTest(num_questions);
		
		return;
	};

/* Function: createQuestionsArray
 * ------------------------------
 * Parses a given test file for a JSON object containing all pertinent question information.
 *
 */
	function createQuestionsArray(language, questions_array) {
		var file;
		if(language === 'english') file = "/questions/english_questions.JSON";
		else file = "/questions/spanish_questions.JSON";
		
		var fileRequest = new XMLHttpRequest();
		var array;

		fileRequest.addEventListener('load', function() {
			if(fileRequest.status != 200) alert("ERROR: File could not be loaded");
			array = jQuery.parseJSON(fileRequest.responseText);
		});

		fileRequest.open("GET", file, false);
		fileRequest.send();

		return array;
	}

/* Function: getRandom
 * -------------------
 * Returns a random integer between 0 and total - 1.
 */
	function getRandom(total) {
		return Math.floor((Math.random() * total));
	}

/* Function: createTestingForm
 * -------------------
 * Returns a random integer between 0 and total - 1.
 */
	function createTestingForm(question) {
		var question_obj = question[current_question_index];
		//Create the Question # element
		var question_str = 'Question';
		var answer_in_lang = 'Answer';
		
		if(language === 'spanish') {
			question_str = 'Pregunta';
			answer_in_lang = 'Repuesta';
		}

		question_obj.number = question_str + " " + String(current_question_index + 1);
		question_obj.answer_in_lang = answer_in_lang;

		var question = handlebarsTemplates.renderQuestion(question_obj);
		$main.html(question);
	}

/* Function: beginTest
 * -------------------
 * Begins the test.
 *
 */
 	function beginTest(num_questions) {
		//Find an index of a question that hasn't been used before
		current_question_index = getRandom(100);
		while($.inArray(current_question_index, taken_questions) != -1) {
			current_question_index = getRandom(100);
		}
		taken_questions.push(current_question_index);

		//Create the first question form
		createTestingForm(questions_array, language);

		//Add listeners to sustain the test taking process
		addListeners();
	}

	function addListeners() {
		//Adds a listener to the main screen to detect if an answer is submitted
		addAnswerFormListener(function(answer) {
			count--;
			var answers = questions_array[current_question_index].answers;
			var alternatives = questions_array[current_question_index].alternatives;

			var min_dist_ratio = 1;	//1.00 is the maximum, where the words have nothing in common
			//Check grammatical answers
			for(var i = 0; i < answers.length; i++) {
				var edit_dist = new Levenshtein(answer.toLowerCase(), answers[i].toLowerCase());
				var ratio = edit_dist / answers[i].length;
				if(ratio < min_dist_ratio) min_dist_ratio = ratio;
			}

			//Check alternative answers as well
			for(var j = 0; j < alternatives.length; j++) {
				edit_dist = new Levenshtein(answer.toLowerCase(), alternatives[j].toLowerCase());
				ratio = edit_dist / alternatives[j].length;
				if(ratio < min_dist_ratio) min_dist_ratio = ratio;
			}

			var correct = min_dist_ratio < EDIT_DIST_RATIO;
			createAnswersPage(correct, answer, answers, language);
		});

		//Adds a listener to the main screen to detect if the "NEXT QUESTION" button is clicked
		addNextButtonListener(function() {
			if(count == 0) {
				ResultsView.showResults();
				return;
			}
			current_question_index = getRandom(100);
			while($.inArray(current_question_index, taken_questions) != -1) {
				current_question_index = getRandom(100);
			}

			taken_questions.push(current_question_index);
			createTestingForm(questions_array, current_question_index);
		});

	}

	function addNextButtonListener(callback) {
		$main.click(function(event) {
			event.preventDefault();
			if(event.target.type === 'button') callback();
		});
	}

	function addAnswerFormListener(callback) {
		$main.submit(function(event) {
			event.preventDefault();
			if(event.target.nodeName === 'FORM') {
				var answer = event.target['answer_input'].value;
				callback(answer);
			}
		});
	}

	/*
	 * Correct is a boolean. If true, the user input was flagged as correct
	 */
	function createAnswersPage(correct, answer, answers, language) {
		var answer_page_obj = {};
		var description;
		if(correct && language === 'spanish') description = "es correcta";
		if(!correct && language === 'spanish') description = "es incorrecta";
		if(correct && language === 'english') description = "is correct";
		if(!correct && language === 'english') description = "is incorrect";

		var next_str = "Next Question";
		if(language === 'spanish') next_str = "Proxima Pregunta";

		answer_page_obj.description = description;
		answer_page_obj.answer = answer;
		answer_page_obj.all_answers = answers;
		answer_page_obj.next = next_str;
		var answer_page_html = handlebarsTemplates.renderAnswerPage(answer_page_obj);
		$main.html(answer_page_html);
	}






	window.TestTakingView = TestTakingView;
})(this, this.document);
