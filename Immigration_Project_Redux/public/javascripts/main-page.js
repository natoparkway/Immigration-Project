(function(window, document, undefined) {

/*
 * Javascript for main-page.ejs. 
 *
 * Adds button listeners to opening screen that detect which button has
 * been pressed (the button indicates langauge).
 * 
 * Then sets URL to the according page.
 */

var $openingScreen = $('#main-page');
var $questionTemplate = $('#question-template');
var $introTemplate = $('#introduction-template');

addOpeningScreenButtonListener();

/*
 * Adds button listeners to the opening screen that detect whether a button indicating the user's language
 * preference is picked.
 */
function addOpeningScreenButtonListener() {
	var language;
	$openingScreen.click(function(event) {
		if(event.target.type != 'button') {
			event.preventDefault();
			return;
		} else if (event.target.id === 'choose-spanish') language = "spanish";
		else if (event.target.id === 'choose-english')  language = "english";

		if(!language) return;
		
		window.location.href = "/" + language;
	});
}

})(this, this.document);