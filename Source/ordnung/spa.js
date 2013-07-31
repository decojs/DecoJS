define([
	"ordnung/spa/Outlet",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/utils"
], function(
	Outlet,
	applyViewModels,
	hashNavigation,
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
		//unsubscribePageEvents();
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


		return applyViewModels(_document, subscribe).then(function(){
			hashNavigation.start(_config, pageChanged, _document);
			return true;
		});
	}

	return {
		start: start
	};
});