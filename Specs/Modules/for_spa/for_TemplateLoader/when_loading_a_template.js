describe("when getting a non existing template", {
	"ordnung/ajax": "Mocks/ajaxMock"
},[
	"ordnung/spa/TemplateLoader",
	"ordnung/ajax"
], function(
	TemplateLoader,
	ajax
){

	var templateLoader,
		resolver;

	beforeEach(function(){
		templateLoader = new TemplateLoader();
		ajax.respondImmediately = false;

		resolver = {
			resolve: sinon.spy(),
			reject: sinon.spy()
		};

		because: {
			templateLoader.loadTemplate("path/to/template", resolver);
		}
	});

	afterEach(function(){
		ajax.spy.reset();
		ajax.respondImmediately = true;
	});

	it("should use ajax to get the template", function(){
		expect(ajax.spy.callCount).toBe(1);
	});

	describe("when the server responds", function(){

		because(function(){
			ajax.callback({
				status: 200,
				responseText: "myTemplate"
			});
		});

		it("the promise should resolve", function(){
			expect(resolver.resolve.callCount).toBe(1);
		});
		it("the promise should resolve with the template content", function(){
			expect(resolver.resolve.firstCall.args[0]).toBe("myTemplate");
		});
	});

	describe("when the server responds with a 404", function(){

		because(function(){
			ajax.callback({
				status: 404,
				responseText: "myTemplate"
			});
		});

		it("the promise should be rejected", function(){
			expect(resolver.reject.callCount).toBe(1);
		});
	});

	describe("when a new template is requetsed before the old one is resolved", function(){

		because(function(){
			templateLoader.loadTemplate("a/second/template");
		});

		it("the original promise should be rejected", function(){
			expect(resolver.reject.callCount).toBe(1);
		});
	});

	describe("when the loading is aborted", function(){

		because(function(){
			templateLoader.abort();
		});

		it("the original promise should be rejected", function(){
			expect(resolver.reject.callCount).toBe(1);
		});
	});
});