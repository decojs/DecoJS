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

		var doc = a_document.withAnOutlet();//an_element.withAViewModel("dummyVM");

		react = sinon.spy();

		define("dummyVM", [], function(){
			return function DummyVM(model, when){
				done();
				when.thisIsDestroyed(react);
			};
		});

		spa.start({}, doc).then(function(){
			hashNavigationMock.navigateToPage("index");
		});
	});

	afterEach(function(){
		require.undef("dummyVM");
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