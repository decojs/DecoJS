describe("when creating a templates", [
	"ordnung/spa/Templates",
	"Given/a_document"
], function(
	Templates,
	a_document
){
	

	var templates,
		doc;

	beforeEach(function(){
		doc = a_document.withPageTemplates();
		templates = new Templates(doc);
	});

	it("should have a constructor taking one argument", function(){
		expect(Templates.length).toBe(1);
	});

	it("should have a getTemplate method", function(){
		expect(templates.getTemplate).toBeDefined();
		expect(templates.getTemplate.length).toBe(1);
	});

	it("should find all templates", function(){
		expect(doc.querySelectorAll.callCount).toBe(1);
		expect(doc.querySelectorAll.firstCall.args[0]).toBe("[type='text/page-template']");
	});
});