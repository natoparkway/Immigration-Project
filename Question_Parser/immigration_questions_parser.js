/* Immigrations questions parser
 * -----------------------------
 * Parses through a given file, creates a JSON object containings the pertinent info, and then writes that object
 * into another file.
 *
 * $ indicates that a response is correct but perhaps an alternative way of phrasing it
 * # indicates a response is a number
 * * indicates that a question is one of those in the shortened test for people over 65 who have been in the country for a while
 *
 * Example Question: {"question":"What is the supreme law of the land?","asterik":"0","answers":["Who knows?"],"alternatives":["the Constitution"]}
 */

var fs = require('fs');

var file_path = process.argv[2];
var file_str = fs.readFileSync(file_path, "utf8");
var dest = process.argv[3];

var lines_array = file_str.split("\n");	//Create an array, each containing a line in the questions documents

var allQuestions = [];		//Array of all questions
var currentQuestion = {};	//Object that is the current question
var answers_array = [];		//Array containing correct answers
var alternatives = [];		//Array containing correct, but not grammatically sound answers


//Parse through each line
lines_array.forEach(function(elem) {
	var number = parseInt(elem);
	if(number <= 100) {		//If we get a number, we know we have a question
		if(number != 1) {
			allQuestions[number - 2].answers = answers_array;		//This will happen once a question has been parsed and we 
			allQuestions[number - 2].alternatives = alternatives;	//are at the next number so we use number - 2 as the index
		}
		answers_array = [];
		alternatives = [];
		determineQuestion(number, elem);
		allQuestions[number - 1] = currentQuestion;
		currentQuestion = {};
	}
	else {
		if(elem.length > 0) {
			if(elem[0] === '#') elem = elem.substring(1, elem.length);
			elem = elem[0].toUpperCase() + elem.slice(1);	//Capitalize
			
			if(elem[0] === '$') alternatives.push(elem.slice(1));	//We don't include the $
			else answers_array.push(elem);
		}
	}

	if(number == 100) {
		allQuestions[99].answers = answers_array;
		allQuestions[99].alternatives = alternatives;
	}
	
});

for(var i = 0; i < 100; i++) {
	if(typeof(allQuestions[i].answers) === 'undefined') console.log(i, allQuestions[i]);
}

function determineQuestion(number, elem) {
	var startpoint = elem.indexOf(".");
	var question = elem.substring(startpoint + 2);
	currentQuestion.question = question;

	if(question[question.length - 1] === "*") {
		currentQuestion.asterik = "1"
		currentQuestion.question = question.substring(0, question.length - 1);
	} else currentQuestion.asterik = "0";	
}


fs.writeFile(dest, JSON.stringify(allQuestions), function(err) {
	//if(err) console.log('error');
});
