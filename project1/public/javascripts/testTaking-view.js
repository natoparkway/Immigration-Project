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
	var incorrect_answers = [];
	var correct_answers = [];


/*
 * Starts the test taking process. 
 * First gets the array of questions and answers from a JSON file.
 * Then calls takeTest, which takes care of test taking process.
 *
 */
	TestTakingView.startTest = function(num_questions, chosen_language) {
		$main.off("click");	//Take off the click listener from the previous view
		$main.off("submit");
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

/*
 * Adds the listeners that detect for the user hitting enter when answering a question and when 
 * a user presses the button to signal that they are ready for the next question.
 */
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
			current_question_index = getRandom(100);
			while($.inArray(current_question_index, taken_questions) != -1) {
				current_question_index = getRandom(100);
			}

			taken_questions.push(current_question_index);
			createTestingForm(questions_array, current_question_index);
		});

	}

/*
 * Adds a listener to the main screen to listen for a button being clicked. (Specifically the button to signal 'next question')
 */
	function addNextButtonListener(callback) {
		$main.click(function(event) {
			event.preventDefault();
			if(count == 0) {
				ResultsView.showResults(correct_answers, incorrect_answers, questions_array, language);
				return;
			} else if(event.target.type === 'button') callback();
		});
	}

/*
 * Adds a listener to the main screen to listen for a form to be submitted - when the user hits submit after typing their answer.
 */
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
		if(correct) {
			if(language === 'spanish') description = "es correcta";
			else description = "is correct";
			correct_answers.push(current_question_index);

		}
		if(!correct) {
			if(language === 'spanish') description = "es incorrecta";
			else description = "is incorrect";
			incorrect_answers.push(current_question_index);

		}

		var next_str = "Next Question";
		var correct_answers_description = "Correct answers include:";
		if(language === 'spanish') {
			next_str = "Proxima Pregunta";
			correct_answers_description = "Repuestas correctas incluyen:";
		}

		answer_page_obj.description = description;
		answer_page_obj.answer = answer;
		answer_page_obj.all_answers = answers;
		answer_page_obj.next = next_str;
		answer_page_obj.correct_answers_description = correct_answers_description;
		var answer_page_html = handlebarsTemplates.renderAnswerPage(answer_page_obj);
		$main.html(answer_page_html);

		if(!correct) $main.find('#answer-description').addClass('incorrect-description');
		else $main.find('#answer-description').addClass('correct-description');
	}






	window.TestTakingView = TestTakingView;
})(this, this.document);
