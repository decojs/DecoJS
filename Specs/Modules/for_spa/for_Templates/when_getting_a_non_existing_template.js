describe("when getting a non existing template", {
	"ordnung/spa/TemplateLoader": "Mocks/TemplateLoaderMock"
},[
	"ordnung/spa/Templates",
	"ordnung/spa/TemplateLoader"
], function(
	Templates,
	TemplateLoader
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
		TemplateLoader.loadTemplateSpy.reset();
		TemplateLoader.abortSpy.reset();
	});

	it("should return a promise", function(){
		expect(result.then).toBeDefined();
	});

	it("should call the loadTemplate method", function(){
		expect(TemplateLoader.loadTemplateSpy.callCount).toBe(1);
	});

	it("should abort the previous loading", function(){
		expect(TemplateLoader.abortSpy.callCount).toBe(1);
	});

	
});