describe("when creating a spa", {
	"ordnung/applyViewModels": "Mocks/applyViewModelsMock"
},[
	"ordnung/spa",
	"ordnung/applyViewModels"
], function(
	spa,
	applyViewModelsSpy
){

	it("should have a start method", function(){
		expect(spa.start).toBeDefined();
	});

	describe("when starting with an empty config", function(){

		var stop;

		beforeEach(function(){
			stop = spa.start({});
		});

		afterEach(function(){
			stop();
			applyViewModelsSpy.reset();
		});

		it("should return a stop method", function(){
			expect(stop).toBeDefined();
		});

		it("should apply viewmodels to the current document", function(){
			expect(applyViewModelsSpy.callCount).toBe(1);
		});

		it("should pass in the current document to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[0]).toBe(document);
		});

		it("should pass in a subscribe function to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[1]).toBeA("function");
		});

	});

});