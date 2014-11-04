(function(window, document, undefined) {

var $openingScreen = $('#main-page');
var $questionTemplate = $('#question-template');
var $introTemplate = $('#introduction-template');

addOpeningScreenButtonListener();

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
			console.log('spanish');
			renderNextScreen('spanish');
		} else if (event.target.id === 'choose-english') {
			console.log('english');
			renderNextScreen('english');
		}
	});
}

function renderNextScreen(language) {
	$.get('/' + language, {
		line1: 'Welcome! You are about to take the exam portion of the United States Citizenship Test.',
		line2: 'The exam is 100 questions long. Right now, you may take all 100 questions, 50 questions or 20 questions.',
		line3: 'Please choose below.',
		line4: 'Or, type the number of questions you want to answer below:'
	}, function(data) {
		console.log('hi', data);
	}, 'json');
}

/**
* Creates a welcome page. Shrinks the title of page and allows user to choice how 
* many questions they would like to see in the subsequent session.
* Also adds button listeners to detect how many questions are going to be used.
*/
function createWelcomePage(language) {

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

	$('#main-page').submit(function(event) {
		event.preventDefault();
		if(event.target.id === 'numquestions') {
			var numQuestions = $(event.target).find('[name="number"]').val();
			//Implement not a number functionality
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
		var text3 = 'O, tipa el numero de preguntas a que quiere responder:';
	} else {
		var welcome = 'Welcome! You are about to take the exam portion of the United States Citizenship Test.';
		var text1 = 'The exam is 100 questions long. Right now, you may take all 100 questions, 50 questions or 20 questions.';
		var text2 = 'Please choose below.';
		var text3 = 'Or, type the number of questions you want to answer below:';

	}

	var introduction = {line1: welcome, line2: text1, line3: text2, line4: text3};
	var intro = handlebarsTemplates.renderIntroForm(introduction);

	$openingScreen.html(intro);
}



})(this, this.document);