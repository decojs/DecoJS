describe("when a viewmodel cannot be found", {
	"ordnung/errorHandler": "Mocks/errorHandlerMock"
},[
	"ordnung/spa/applyViewModels",
	"Given/an_element",
	"ordnung/errorHandler"
], function(
	applyViewModels,
	an_element,
	errorHandler
){

	var subscribe,
		realRequire;

	beforeEach(function(done){

		realRequire = require;
		require = sinon.stub().callsArgWith(2, {requireModules:["IdoNotExist", "IdoNotExistEither"]});

		subscribe = sinon.spy();
		
		var elm = an_element.withAViewModel("IdoNotExist", {});

		because: {
			applyViewModels(elm, subscribe).then(done);
		}
	});

	afterEach(function(){
		errorHandler.onError.reset();
		require = realRequire;
	});

	it("should report the error to the errorHandler", function(){
		expect(errorHandler.onError.callCount).toBe(1);
	});

	it("should pass an error to the errorHandler", function(){
		expect(errorHandler.onError.firstCall.args[0]).toBeAn(Error);
	});

	it("should put each module on a separate line", function(){
		expect(errorHandler.onError.firstCall.args[0].message).toBe("Could not load the following modules:\nIdoNotExist\nIdoNotExistEither");
	});
});