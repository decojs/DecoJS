describe("when creating a templates", {
	"deco/spa/PageLoader": function(){ return sinon.spy(); }
},[
	"deco/spa/Templates",
	"Given/a_document",
	"deco/spa/PageLoader"
], function(
	Templates,
	a_document,
	PageLoader
){
	

	var templates,
		doc;

	beforeEach(function(){
		doc = a_document.withPageTemplates();
		templates = new Templates(doc);
	});

	afterEach(function(){
		PageLoader.reset();
	});

	it("should have a constructor taking two arguments", function(){
		expect(Templates.length).toBe(2);
	});

	it("should create a PageLoader", function(){
		expect(PageLoader.callCount).toBe(1);
	});

	it("should send a default config to the PageLoader", function(){
		expect(PageLoader.firstCall.args[0]).toBeAn(Object);
	});

	it("the default config shuld have a pathToUrl function", function(){
		expect(PageLoader.firstCall.args[0].pathToUrl).toBeA(Function);
	});

	it("the default config.pathToUrl should be an identity function", function(){
		expect(PageLoader.firstCall.args[0].pathToUrl("test")).toBe("test");
	});

	it("should have a getTemplate method", function(){
		expect(templates.getTemplate).toBeDefined();
		expect(templates.getTemplate.length).toBe(1);
	});

	it("should find all templates", function(){
		expect(doc.querySelectorAll.callCount).toBe(1);
		expect(doc.querySelectorAll.firstCall.args[0]).toBe("[type='text/page-template']");
	});

	describe("with a config", function(){

		var config;

		beforeEach(function(){

			PageLoader.reset();

			config = {
				pathToUrl: sinon.spy()
			};

			templates = new Templates(doc, config);
		});

		afterEach(function(){
			PageLoader.reset();
		});

		it("should send the config to the PageLoader", function(){
			expect(PageLoader.firstCall.args[0]).toBe(config);
		});

	});
});