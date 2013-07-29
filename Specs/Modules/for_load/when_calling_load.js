describe(["ordnung/load"], "when calling load", function(load){

	var dummyVM,
		promise;

	beforeEach(function(){

		var elm = document.createElement("div");

		because: {
			promise = load(elm);
		}
	});

	it("should return a promise", function(){
		expect(promise).toBeDefined();
		expect(promise.then).toBeDefined();
	});

});