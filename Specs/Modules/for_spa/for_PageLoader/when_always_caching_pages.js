describe("when always caching pages", {
	"ordnung/ajax": "Mocks/ajaxMock"
},[
	"ordnung/spa/PageLoader",
	"ordnung/ajax"
], function(
	PageLoader,
	ajax
){

	var pageLoader,
		resolver;

	beforeEach(function(){

		var config = {
			cachePages: true
		};

		pageLoader = new PageLoader(config);
		ajax.respondImmediately = false;

		resolver = {
			resolve: sinon.spy(),
			reject: sinon.spy()
		};

		because: {
			pageLoader.loadPage("path/to/cached/page", resolver);
		}
	});

	afterEach(function(){
		ajax.spy.reset();
		ajax.respondImmediately = true;
	});

	it("should not add random numbers to the end of the url", function(){
		expect(ajax.spy.firstCall.args[0]).toBe("path/to/cached/page");
	});
});