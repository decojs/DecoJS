describe("when extracting and running JavaScript", [
	"ordnung/spa/Outlet",
	"Given/an_element",
	"Given/a_document"
], function(
	Outlet,
	an_element,
	a_document
){
	
	var outlet,
		elm,
		doc;


	describe("the correct way", function(){
		beforeEach(function(){

			doc = a_document.withATitleAndBody("my pretty page");

			elm = an_element.withScriptTagsWithIds();

			outlet = new Outlet(elm, doc);

			because: {
				outlet.extractAndRunPageJavaScript();
			}
		});

		it("should append all the script tags to the body", function(){
			expect(doc.body.children.length).toBe(5);
		});

	});

	describe("when the script tags don't have ids", function(){
		beforeEach(function(){

			doc = a_document.withATitleAndBody("my pretty page");

			elm = an_element.withScriptTags();

			outlet = new Outlet(elm, doc);
		});

		it("should throw an error", function(){
			expect(function(){
				outlet.extractAndRunPageJavaScript();
			}).toThrow();
		});

	});

	describe("when the document already has script tags with the same ids", function(){
		beforeEach(function(){

			doc = a_document.withATitleAndBodyWithScriptTags("my pretty page");

			elm = an_element.withScriptTagsWithIds();

			outlet = new Outlet(elm, doc);

			because: {
				outlet.extractAndRunPageJavaScript();
			}
		});

		it("should not add the new script tags", function(){
			expect(doc.body.children.length).toBe(5);
		});

	});

});