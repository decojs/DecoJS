define([
	"ordnung/spa/Outlet",
	"ordnung/spa/EventSubscriber",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/spa/Templates",
	"ordnung/utils"
], function(
	Outlet,
	EventSubscriber,
	applyViewModels,
	hashNavigation,
	Templates,
	utils
){

	var _config = {
			index: "index"
		},
		_document,
		_outlet,
		_originalTitle,
		_templates,
		_currentPageEventSubscriber;

	function applyContent(content){
		_outlet.unloadCurrentPage();
		_outlet.setPageContent(content);
		_outlet.setDocumentTitle(_outlet.getPageTitle() || _originalTitle);
		_outlet.extractAndRunPageJavaScript();
		return applyViewModels(_outlet.element, _currentPageEventSubscriber.subscribe);
	}

	function pageChanged(path){
		_outlet.indicatePageIsLoading();
		_currentPageEventSubscriber.unsubscribeAllEvents();
		return _templates.getTemplate(path)
			.then(applyContent)
			.then(function(){
				_outlet.pageHasLoaded();
			});
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);
		_outlet = new Outlet(_document.querySelector("[data-outlet]"), _document);
		_originalTitle = _document.title;
		_templates = new Templates(_document, _config);
		_currentPageEventSubscriber = new EventSubscriber();

		return applyViewModels(_document, _currentPageEventSubscriber.subscribeForever).then(function(){
			hashNavigation.start(_config, pageChanged, _document);
		});
	}

	return {
		start: start
	};
});