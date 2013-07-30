describe("when creating a templates", [
	"ordnung/Templates"
], function(
	Templates
){
	

	var templates;

	beforeEach(function(){
		templates = new Templates();
	});

	it("should have a constructor taking one argument", function(){
		expect(Templates.length).toBe(1);
	});

	it("should have a getTemplate method", function(){
		expect(templates.getTemplate).toBeDefined();
		expect(templates.getTemplate.length).toBe(1);
	});
});