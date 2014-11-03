(function(window, document, undefined) {

	//Handlebars helper. Context is the array, options is the handlebars function.
	Handlebars.registerHelper('each', function(context, options) {
  		var ret = "";

  		for(var i=0, j=context.length; i<j; i++) {
	    	ret = ret + options.fn(context[i]);
	  	}

  		return ret;
	});

	introductionView.introduce();

})(this, this.document);