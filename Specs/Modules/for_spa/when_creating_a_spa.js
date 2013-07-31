describe("when creating a spa", {
	"ordnung/spa/applyViewModels": "Mocks/applyViewModelsMock",
	"ordnung/spa/hashNavigation": function(){return {start: sinon.spy()}}
},[
	"ordnung/spa",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation"
], function(
	spa,
	applyViewModelsSpy,
	hashNavigation
){

	it("should have a start method", function(){
		expect(spa.start).toBeDefined();
	});

	describe("when starting with an empty config", function(){

		var promise;

		because(function(done){
			promise = spa.start({});
			promise.then(done);
		});

		afterEach(function(){
			applyViewModelsSpy.reset();
			hashNavigation.start.reset();
		});

		it("should return a promise", function(){
			expect(promise).toBeDefined();
			expect(promise.then).toBeDefined();
		});

		it("should apply viewmodels to the current document", function(){
			expect(applyViewModelsSpy.callCount).toBe(1);
		});

		it("should pass in the current document to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[0]).toBe(document);
		});

		it("should pass in a subscribe function to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[1]).toBeA(Function);
		});

		it("should start the hashNavigation", function(){
			expect(hashNavigation.start.callCount).toBe(1);
		});

	});

});