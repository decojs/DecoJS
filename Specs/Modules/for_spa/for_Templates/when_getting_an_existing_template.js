describe("when getting an existing template", {
	"ordnung/spa/PageLoader": "Mocks/PageLoaderMock"
},[
	"ordnung/spa/Templates",
	"ordnung/spa/PageLoader",
	"Given/a_document"
], function(
	Templates,
	PageLoader,
	a_document
){

	var templates,
		result;

	beforeEach(function(){
		templates = new Templates(a_document.withPageTemplates());
		because: {
			result = templates.getTemplate("myTemplate");
		}
	});

	afterEach(function(){
		PageLoader.loadPageSpy.reset();
		PageLoader.abortSpy.reset();
	});

	it("should return a promise", function(){
		expect(result.then).toBeDefined();
	});

	it("should abort the previous loading", function(){
		expect(PageLoader.abortSpy.callCount).toBe(1);
	});

	it("should resolve the promise to a template", function(done){
		result.then(function(template){
			expect(template).toBe("<p>my template</p>");
			done();
		});
	});

	
});