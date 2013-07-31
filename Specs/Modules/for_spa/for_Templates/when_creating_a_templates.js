describe("when creating a templates", {
	"ordnung/spa/PageLoader": function(){ return sinon.spy(); }
},[
	"ordnung/spa/Templates",
	"Given/a_document",
	"ordnung/spa/PageLoader"
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

	it("should send a default pathToUrl to the PageLoader", function(){
		expect(PageLoader.firstCall.args[0]).toBeA(Function);
	});

	it("the default pathToUrl should be an identity function", function(){
		expect(PageLoader.firstCall.args[0]("test")).toBe("test");
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

		it("should send the config.pathToUrl to the PageLoader", function(){
			expect(PageLoader.firstCall.args[0]).toBe(config.pathToUrl);
		});

	});
});