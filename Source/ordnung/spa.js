define([
	"ordnung/spa/applyViewModels",
	"ordnung/utils"
], function(
	applyViewModels,
	utils
){

	var _config = {},
		_document;

	function applyContent(content){
		//unloadCurrentPage();
		//loadNextPage(content);
		//setPageTitle();
		//runPageJavaScript();
		//return applyViewModels(_outlet, subscribe);
	}

	function pageChanged(path){
		//setPageIsLoading();
		//templates.getTemplate(path)
		//.then(applyContent)
		//.then(setPageHasLoaded);
	}

	function subscribe(event, reaction){
		event(reaction);
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);

		//_hashNavigation = new HashNavigation(_document);
		//_hashNavigation.onPageChanged(pageChanged);

		return applyViewModels(_document, subscribe).then(function(){
			//return _hashNavigation.start();
		}).then(function(){

		});
	}

	return {
		start: start
	};
});