describe("when the page loader returns a 404", {
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
		result,
		loadPageSpy;

	beforeEach(function(){

		loadPageSpy = sinon.spy();

		PageLoader.prototype.loadPage = function(path, resolver){
			loadPageSpy(path, resolver);
			resolver.reject({error: 404, content: "oh noes!"});
		}

	});

	afterEach(function(){
		PageLoader.prototype.loadPage = PageLoader.loadPageSpy;
		PageLoader.abortSpy.reset();
	});

	describe("when the document contains an error404 template", function(){

		beforeEach(function(){
			templates = new Templates(a_document.withAnError404Template());
			because: {
				result = templates.getTemplate("path/to/non/existing/template");
			}
		});

		it("should return a promise", function(){
			expect(result.then).toBeDefined();
		});

		it("should call the loadPage method", function(){
			expect(loadPageSpy.callCount).toBe(1);
		});

		it("should abort the previous loading", function(){
			expect(PageLoader.abortSpy.callCount).toBe(1);
		});

		it("should resolve the promise to a template", function(done){
			result.then(function(template){
				expect(template).toBe("could not be found");
				done();
			});
		});
	});

	describe("when the document does not contain an error404 template", function(){

		beforeEach(function(){
			templates = new Templates(document);
			because: {
				result = templates.getTemplate("path/to/non/existing/template");
			}
		});

		it("should return a promise", function(){
			expect(result.then).toBeDefined();
		});

		it("should call the loadPage method", function(){
			expect(loadPageSpy.callCount).toBe(1);
		});

		it("should abort the previous loading", function(){
			expect(PageLoader.abortSpy.callCount).toBe(1);
		});

		it("should resolve the promise to a template", function(done){
			result.then(function(template){
				expect(template).toBe("oh noes!");
				done();
			});
		});

	});

	
});