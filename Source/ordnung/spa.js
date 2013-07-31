define([
	"ordnung/spa/Outlet",
	"ordnung/spa/applyViewModels",
	"ordnung/utils"
], function(
	Outlet,
	applyViewModels,
	utils
){

	var _config = {},
		_document;

	function applyContent(content){
		//this.outlet.unloadCurrentPage();
		//this.outlet.setPageContent(content);
		//this.outlet.setDocumentTitle(this.outlet.getPageTitle() || _originalTitle);
		//this.outlet.extractAndRunPageJavaScript();
		//return applyViewModels(this.outlet.element, subscribe);
	}

	function pageChanged(path){
		//this.outlet.indicatePageIsLoading();
		//templates.getTemplate(path)
		//.then(applyContent)
		//.then(function(){
		//	this.outlet.pageHasLoaded();
		//});
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