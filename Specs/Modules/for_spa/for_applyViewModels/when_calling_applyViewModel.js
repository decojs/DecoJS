describe(["ordnung/spa/applyViewModels"], "when calling applyViewModels", function(applyViewModels){

	var promise;

	beforeEach(function(){

		var elm = document.createElement("div");

		because: {
			promise = applyViewModels(elm);
		}
	});

	it("should return a promise", function(){
		expect(promise).toBeDefined();
		expect(promise.then).toBeDefined();
	});

});