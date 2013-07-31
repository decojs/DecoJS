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
		_document,
		_outlet;

	function applyContent(content){
		//_outlet.unloadCurrentPage();
		//_outlet.setPageContent(content);
		//_outlet.setDocumentTitle(_outlet.getPageTitle() || _originalTitle);
		//_outlet.extractAndRunPageJavaScript();
		//return applyViewModels(_outlet.element, subscribe);
	}

	function pageChanged(path){
		//_outlet.indicatePageIsLoading();
		//unsubscribePageEvents();
		//templates.getTemplate(path)
		//.then(applyContent)
		//.then(function(){
		//	_outlet.pageHasLoaded();
		//});
	}

	function subscribe(event, reaction){
		event(reaction);
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);

		_outlet = new Outlet(_document.querySelector("[data-outlet]"), _document);

		return applyViewModels(_document, subscribe).then(function(){
			hashNavigation.start(_config, pageChanged, _document);
		});
	}

	return {
		start: start
	};
});