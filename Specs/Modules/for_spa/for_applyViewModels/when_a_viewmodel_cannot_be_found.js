describe("when_a_viewmodel_cannot_be_found", {
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

	var subscribe;

	beforeEach(function(done){

		subscribe = sinon.spy();
		
		var elm = an_element.withAViewModel("IdoNotExist", {});

		because: {
			applyViewModels(elm, subscribe).then(done);
		}
	});

	afterEach(function(){
		errorHandler.onError.reset();
	});

	it("should report the error to the errorHandler", function(){
		expect(errorHandler.onError.callCount).toBe(1);
	});

	it("should pass an error to the errorHandler", function(){
		expect(errorHandler.onError.firstCall.args[0]).toBeAn(Error);
	});
});