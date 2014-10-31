(function(window, document, undefined) {

var $openingScreen = $('#main-page');
var $questionTemplate = $('#question-template');
var $introTemplate = $('#introduction-template');


var handlebarsTemplates = {
	renderQuestionForm: Handlebars.compile($questionTemplate.html()),
	renderIntroForm: Handlebars.compile($introTemplate.html())
};


addOpeningScreenButtonListener();
//TestTakingView.startTest(10, 'english');
/*
 * Adds button listeners to the opening screen that detech whether a button indicating the user's language
 * preference is picked.
 * Method then calls createWelcomePage.
 */
function addOpeningScreenButtonListener() {
	$openingScreen.click(function(event) {
		if(event.target.type != 'button') {
			event.preventDefault();
			return;
		} else if (event.target.id === 'choose-spanish') {
			createWelcomePage('spanish');
		} else if (event.target.id === 'choose-english') {
			createWelcomePage('english');
		}
	});

}

/**
* Creates a welcome page. Shrinks the title of page and allows user to choice how 
* many questions they would like to see in the subsequent session.
* Also adds button listeners to detect how many questions are going to be used.
*/
function createWelcomePage(language) {
	shrinkTitle(language);
	introduceTest(language);
	addTestSpecificationsListeners(language);
}

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
}

/**
* Instatiates introduction to the test using handlebars.
*
*/
function introduceTest(language) {
	if(language === 'spanish') {
		var welcome = 'Bienvenidos! Este es el la porción de examen del examen para la ciudadanía estadounidense.';
		var text1 = 'El examen es 100 preguntas. Ahora, puede elegir tomar todo, 50, o 20 preguntas.';
		var text2 = 'Elige abajo.';
	} else {
		var welcome = 'Welcome! You are about to take the exam portion of the United States Citizenship Test.';
		var text1 = 'The exam is 100 questions long. Right now, you may take all 100 questions, 50 questions or 20 questions.';
		var text2 = 'Please choose below.';

	}

	var introduction = {line1: welcome, line2: text1, line3: text2};
	var intro = handlebarsTemplates.renderIntroForm(introduction);

	$openingScreen.html(intro);
}

/**
* Shrinks the title 
*
*/
function shrinkTitle(language) {
	var $titleBar = $('#title-bar');
	var $spanishTitle = $('#spanish-title');
	var $englishTitle = $('#english-title');

	if(language === 'spanish') {
		$englishTitle.remove();
	} else {
		$spanishTitle.remove();
	}

	var titleBarHeight = (parseInt($titleBar.css('height')) / 2).toString() + 'px';
	$titleBar.css('height', titleBarHeight);
}



})(this, this.document);