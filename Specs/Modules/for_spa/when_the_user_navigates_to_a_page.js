describe("when the user naviagtes to a page", {
	"ordnung/spa/whenContext": "Mocks/whenContextMock",
	"ordnung/spa/applyViewModels": "Mocks/applyViewModelsMock",
	"ordnung/spa/hashNavigation": "Mocks/hashNavigationMock",
	"ordnung/spa/Outlet": "Mocks/OutletMock",
	"ordnung/spa/Templates": "Mocks/TemplatesMock"
},[
	"ordnung/spa",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/spa/Outlet",
	"ordnung/spa/Templates",
	"ordnung/spa/whenContext"
], function(
	spa,
	applyViewModelsSpy,
	hashNavigationSpy,
	OutletSpy,
	TemplatesSpy,
	whenContextMock
){

	var promise,
		doc;

	beforeEach(function(done){

		doc = {
			querySelector: function(){
				return document.createElement("div");
			},
			location: {
				hash: "#/index",
				replace: sinon.spy()
			},
			title: "original title"
		};

		OutletSpy.prototype.element = "something";
		OutletSpy.outletExists.returns(true);

		promise = spa.start({}, doc);
		promise.then(done);

		applyViewModelsSpy.reset();
	});

	afterEach(function(){
		applyViewModelsSpy.reset();
		OutletSpy.reset();
		TemplatesSpy.reset();
	});

	describe("when the page has changed", function(){
		because(function(done){
			hashNavigationSpy.listener()("some/path").then(done);
		});

		it("should indicate on the outlet that the page is loading", function(){
			expect(OutletSpy.indicatePageIsLoading.callCount).toBe(1);
		});

		it("should get the correct template", function(){
			expect(TemplatesSpy.getTemplate.callCount).toBe(1);
			expect(TemplatesSpy.getTemplate.firstCall.args[0]).toBe("some/path");
		});

		it("should tell the outlet to unload the current page", function(){
			expect(OutletSpy.unloadCurrentPage.callCount).toBe(1);
		});

		it("should tell the outlet what the new content is", function(){
			expect(OutletSpy.setPageContent.callCount).toBe(1);
			expect(OutletSpy.setPageContent.firstCall.args[0]).toBe("<p>my template</p>");
		});

		it("should tell the outlet to extract and run the page JavaScript", function(){
			expect(OutletSpy.extractAndRunPageJavaScript.callCount).toBe(1);
		});

		it("should tell the outlet when to stop loading", function(){
			expect(OutletSpy.pageHasLoaded.callCount).toBe(1);
		});

		it("should apply viewModels to the outlet", function(){
			expect(applyViewModelsSpy.callCount).toBe(1);
			expect(applyViewModelsSpy.firstCall.args[0]).toBe("something");
			expect(applyViewModelsSpy.firstCall.args[1]).toBeA(Function);
		});

		it("should unsubscribe from the page events", function(){
			expect(whenContextMock.context[0].destroyChildContexts.callCount).toBe(1);
		});

	});

	describe("when the page has no title", function(){
		because(function(done){
			OutletSpy.getPageTitle.returns("");
			hashNavigationSpy.listener()("some/path").then(done);
		});

		it("should set the title to the original document title", function(){
			expect(OutletSpy.setDocumentTitle.callCount).toBe(1);
			expect(OutletSpy.setDocumentTitle.firstCall.args[0]).toBe("original title");
		});
	});

	describe("when the page has a title", function(){
		because(function(done){
			OutletSpy.getPageTitle.returns("a title");
			hashNavigationSpy.listener()("some/path").then(done);
		});

		it("should set the title to the new page title", function(){
			expect(OutletSpy.setDocumentTitle.callCount).toBe(1);
			expect(OutletSpy.setDocumentTitle.firstCall.args[0]).toBe("a title");
		});
	});
});