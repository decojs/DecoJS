describe("when getting a non existing template", {
	"ordnung/spa/PageLoader": "Mocks/PageLoaderMock"
},[
	"ordnung/spa/Templates",
	"ordnung/spa/PageLoader"
], function(
	Templates,
	PageLoader
){

	var templates,
		result;

	beforeEach(function(){
		templates = new Templates(document);
		because: {
			result = templates.getTemplate("path/to/template");
		}
	});

	afterEach(function(){
		PageLoader.loadPageSpy.reset();
		PageLoader.abortSpy.reset();
	});

	it("should return a promise", function(){
		expect(result.then).toBeDefined();
	});

	it("should call the loadPage method", function(){
		expect(PageLoader.loadPageSpy.callCount).toBe(1);
	});

	it("should abort the previous loading", function(){
		expect(PageLoader.abortSpy.callCount).toBe(1);
	});

	
});