define([
	"knockout"
], function(
	ko
){

	function Outlet(element, document){
		this.element = element;
		this.document = document || window.document;
	}

	Outlet.prototype.unloadCurrentPage = function(){
		ko.cleanNode(this.element);
		this.element.innerHTML = "";
	};

	Outlet.prototype.setPageContent = function(content){
		this.element.innerHTML = content;
	};

	Outlet.prototype.getPageTitle = function(){
		var titleMetaTag = this.element.querySelector("title");
		return (titleMetaTag && titleMetaTag.textContent);
	};

	Outlet.prototype.setDocumentTitle = function(title){
		this.document.title = title;
	};

	Outlet.prototype.extractAndRunPageJavaScript = function(){

	};

	Outlet.prototype.indicatePageIsLoading = function(){
		this.element.setAttribute("data-loading", "true");
	};

	Outlet.prototype.pageHasLoaded = function(){
		this.element.setAttribute("data-loading", "false");
	};


	return Outlet;

});