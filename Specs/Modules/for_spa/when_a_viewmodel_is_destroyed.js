describe("when the viewmodel is destroyed", {
	"ordnung/spa/hashNavigation": "Mocks/hashNavigationMock"
},[
	"ordnung/spa",
	"Given/an_element",
	"Given/a_document",
	"ordnung/spa/hashNavigation"
], function(
	spa,
	an_element,
	a_document,
	hashNavigationMock
){

	var react;

	beforeEach(function(done){

		var doc = a_document.withAnOutlet("DestroyVM");

		react = sinon.spy();

		define("DestroyVM", [], function(){
			return function DestroyVM(model, when){
				done();
				when.thisIsDestroyed(react);
			};
		});

		spa.start({}, doc).then(function(){
			hashNavigationMock.navigateToPage("index");
		});
	});

	afterEach(function(){
		require.undef("DestroyVM");
	});

	describe("when the page changes", function(){

		beforeEach(function(){
			hashNavigationMock.navigateToPage("destroy/viewmodel/path");
		});

		it("should call the onDestroy listener", function(){
			expect(react.callCount).toBe(1);
		});

	});

});