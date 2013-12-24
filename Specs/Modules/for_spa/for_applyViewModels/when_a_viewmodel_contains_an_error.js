describe("when_a_viewmodel_contains_an_error", {
	"deco/errorHandler": "Mocks/errorHandlerMock"
},[
	"deco/spa/applyViewModels",
	"Given/an_element",
	"deco/errorHandler"
], function(
	applyViewModels,
	an_element,
	errorHandler
){

	var subscribe;

	beforeEach(function(done){

		subscribe = sinon.spy();

		define("ErrorVM", [], function(){
			return function ErrorVM(){
				throw new Error("uh oh!");
			};
		});
		
		var elm = an_element.withAViewModel("ErrorVM", {});

		because: {
			applyViewModels(elm, subscribe).then(done);
		}
	});

	afterEach(function(){
		require.undef("ErrorVM");
		errorHandler.onError.reset();
	});

	it("should report the error to the errorHandler", function(){
		expect(errorHandler.onError.callCount).toBe(1);
	});

	it("should pass an error to the errorHandler", function(){
		expect(errorHandler.onError.firstCall.args[0]).toBeAn(Error);
	});
});