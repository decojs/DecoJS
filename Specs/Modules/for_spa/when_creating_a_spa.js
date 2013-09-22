describe("when creating a spa", {
	"ordnung/spa/applyViewModels": "Mocks/applyViewModelsMock",
	"ordnung/spa/hashNavigation": function(){return {start: sinon.spy()}},
	"ordnung/spa/Outlet": "Mocks/OutletMock",
	"ordnung/spa/Templates": function(){return sinon.spy();}
},[
	"ordnung/spa",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/spa/Outlet",
	"ordnung/spa/Templates"
], function(
	spa,
	applyViewModelsSpy,
	hashNavigationSpy,
	OutletSpy,
	TemplatesSpy
){

	it("should have a start method", function(){
		expect(spa.start).toBeDefined();
	});

	describe("when starting with an empty config", function(){

		var promise,
			doc;

		beforeEach(function(done){

			doc = {
				querySelector: sinon.spy(),
				location: {
					hash: "",
					replace: sinon.spy()
				}

			};

			promise = spa.start({}, doc);
			promise.then(done);
		});

		afterEach(function(){
			applyViewModelsSpy.reset();
			hashNavigationSpy.start.reset();
			OutletSpy.reset();
			TemplatesSpy.reset();
		});

		it("should return a promise", function(){
			expect(promise).toBeDefined();
			expect(promise.then).toBeDefined();
		});

		it("should apply viewmodels to the current document", function(){
			expect(applyViewModelsSpy.callCount).toBe(1);
		});

		it("should pass in the current document to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[0]).toBe(doc);
		});

		it("should pass in a subscribe function to the applyViewModels", function(){
			expect(applyViewModelsSpy.firstCall.args[1]).toBeA(Function);
		});

		it("should find the outlet in the document", function(){
			expect(doc.querySelector.callCount).toBe(1);
			expect(doc.querySelector.firstCall.args[0]).toBe("[data-outlet]");
		});

		it("should create an outlet", function(){
			expect(OutletSpy.constructed.callCount).toBe(1);
		});

		it("should start the hashNavigation", function(){
			expect(hashNavigationSpy.start.callCount).toBe(1);
		});

		it("should set a default index if one is not provided", function(){
			expect(hashNavigationSpy.start.firstCall.args[0].index).toBe("index");
		});

		it("should create a templates repository", function(){
			expect(TemplatesSpy.callCount).toBe(1);
		});

	});

});