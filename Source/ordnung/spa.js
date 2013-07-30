define([
	"ordnung/applyViewModels",
	"ordnung/utils"
], function(
	applyViewModels,
	utils
){

	var _config = {},
		_document;


	function subscribe(){
		
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);



		return applyViewModels(_document, subscribe).then(function(){

		});
	}

	return {
		start: start
	};
});