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
			//NOTHING FOR NOW
		} else if (event.target.id === 'choose-english') {
			//NORTHING FOR NOW
		}
	});
}

})(this, this.document);