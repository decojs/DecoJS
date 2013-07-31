define([
	"ordnung/spa/Outlet",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/spa/Templates",
	"ordnung/utils"
], function(
	Outlet,
	applyViewModels,
	hashNavigation,
	Templates,
	utils
){

	var _config = {},
		_document,
		_outlet,
		_originalTitle,
		_currentPageEventSubscribers = [],
		_templates;

	function applyContent(content){
		_outlet.unloadCurrentPage();
		_outlet.setPageContent(content);
		_outlet.setDocumentTitle(_outlet.getPageTitle() || _originalTitle);
		_outlet.extractAndRunPageJavaScript();
		return applyViewModels(_outlet.element, subscribe);
	}

	function pageChanged(path){
		_outlet.indicatePageIsLoading();
		unsubscribePageEvents();
		return _templates.getTemplate(path)
			.then(applyContent)
			.then(function(){
				_outlet.pageHasLoaded();
			});
	}

	function unsubscribePageEvents(){
		var stopSubscription;
		while(stopSubscription = _currentPageEventSubscribers.pop()){
			stopSubscription();
		}
	}

	function subscribe(event, reaction){
		_currentPageEventSubscribers.push(function(){
			event.dont(reaction);
		});
		event(reaction);
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);
		_outlet = new Outlet(_document.querySelector("[data-outlet]"), _document);
		_originalTitle = document.title;
		_templates = new Templates(_document, _config);

		return applyViewModels(_document, subscribe).then(function(){
			hashNavigation.start(_config, pageChanged, _document);
		});
	}

	return {
		start: start
	};
});