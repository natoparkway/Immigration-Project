(function(window, document, undefined) {
	
	/*
var questions = [
	{question: "Will this work?",
	hint: "I don't know"
	}
];
	*/

	var TestTakingView = {};
	var $question_template = $('#question-template');
	var $main = $('#main-page');
	var handlebarsTemplates = {
	renderQuestion: Handlebars.compile($question_template.html()),
	};

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
	TestTakingView.startTest = function(num_questions, language) {
		var questions = createQuestionsArray(language);

		takeTest(num_questions, questions, language);
		return;
	};

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

	function getRandom(total) {
		return Math.floor((Math.random() * total));
	}

	function takeTest(num_questions, questions, language) {
		var taken_questions = [];

		var question_index = getRandom(100);
		while($.inArray(question_index, taken_questions) != -1) {
			question_index = getRandom(100);
		}
		taken_questions.push(question_index);

		var question_obj = questions[question_index];
		//Create the Question # element
		var question_str = 'Question';
		if(language === 'spanish') question_str = 'Pregunta';
		question_obj.number = question_str + " " + String(question_index);

		addAnswers(question_index, questions, question_obj);

		var question = handlebarsTemplates.renderQuestion(question_obj);
		$main.html(question);
	}

	function addAnswers(question_index, questions, question_obj) {
		var row1 = [];
		var row2 = [];
		var row3 = [];
		var possible_answers = [];

		var num_cols = 3;
		var total_answers = 9;

		//Finds 9 answers to random problems that are not the intended one
		for(var j = 0; j < total_answers; j++) {
			var index= getRandom(100);
			while(index == question_index) index = getRandom(100);	//Don't pick the correct question

			var random_question = questions[index];
			var random_answer_index = getRandom(random_question.answers.length);
			possible_answers.push(random_question.answers[random_answer_index]);
			//console.log(random_answer_index, random_question.answers[random_answer_index], random_question.answers.length);
		}

		//Add one possible correct answer at a random place in the possible answers array
		var correct_index = getRandom(total_answers);
		var current_question = questions[question_index];
		var correct_answer_index = getRandom(current_question.answers.length);
		possible_answers.splice(correct_index, 1, current_question.answers[correct_answer_index]);

		//Puts the answers into rows
		for(var i = 0; i < total_answers; i++) {
			switch(i % 3) {
				case 0:
					row1.push(possible_answers[i]);
					break;
				case 1:
					row2.push(possible_answers[i]);
					break;
				case 2:
					row3.push(possible_answers[i]);
					break;
			}
		}

		question_obj.row1 = row1;
		question_obj.row2 = row2;
		question_obj.row3 = row3;

	}






	window.TestTakingView = TestTakingView;
})(this, this.document);
