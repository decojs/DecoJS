describe("when", {
	"knockout": function(){
		return {
			cleanNode: sinon.spy()
		};
	}
},[
	"ordnung/spa/Outlet",
	"Given/an_element",
	"knockout"
], function(
	Outlet,
	an_element,
	ko
){
	
	var outlet,
		elm;

	beforeEach(function(){

		elm = an_element.withChildrenAndATitle("my page title");


		outlet = new Outlet(elm, document);
	});

	describe("unloading the current page", function(){

		because(function(){
			outlet.unloadCurrentPage();
		});

		afterEach(function(){
			ko.cleanNode.reset();
		});

		it("should remove the elements in the outlet", function(){
			expect(elm.children.length).toBe(0);
		});

		it("should remove all knockout event listeners", function(){
			expect(ko.cleanNode.callCount).toBe(1);
		});
	});

	describe("setting the page content", function(){

		because(function(){
			outlet.setPageContent("<p>new content</p>");
		});

		it("should have one child node", function(){
			expect(elm.children.length).toBe(1);
		});

		it("should have the content as its innerHTML", function(){
			expect(elm.innerHTML).toBe("<p>new content</p>");
		});
	});

	describe("getting the page title (when it exists)", function(){
		
		it("should return the correct title", function(){
			expect(outlet.getPageTitle()).toBe("my page title");
		});

	});

	describe("getting the page title (when it doesn't exists)", function(){

		beforeEach(function(){

			elm = an_element.withChildren();

			outlet = new Outlet(elm, document);
		});
		
		it("should return the correct title", function(){
			expect(outlet.getPageTitle()).toBe(null);
		});

	});

	describe("setting the document title to a string", function(){

		because(function(){
			outlet.setDocumentTitle("new title");
		});

		it("should set the title of the document", function(){
			expect(document.title).toBe("new title");
		});
	});

	describe("indicating that a page is loading", function(){

		because(function(){
			outlet.indicatePageIsLoading();
		});

		it("should set the data-loading attribute to true", function(){
			expect(elm.getAttribute("data-loading")).toBe("true");
		});
	});

	describe("the page has loaded", function(){

		because(function(){
			outlet.pageHasLoaded();
		});

		it("should set the data-loading attribute to false", function(){
			expect(elm.getAttribute("data-loading")).toBe("false");
		});
	});

});