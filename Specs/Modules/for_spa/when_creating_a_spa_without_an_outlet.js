describe("when creating a spa without an outlet", {
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


	var promise,
		doc;

	beforeEach(function(done){

		doc = {
			querySelector: sinon.spy()

		};
		OutletSpy.outletExists.returns(false);

		promise = spa.start({}, doc);
		promise.then(done);
	});

	afterEach(function(){
		applyViewModelsSpy.reset();
		hashNavigationSpy.start.reset();
		OutletSpy.reset();
		TemplatesSpy.reset();
	});

	it("should ask the outlet if there is an outlet", function(){
		expect(OutletSpy.outletExists.callCount).toBe(1);
	});

	it("should apply view models to the document", function(){
		expect(applyViewModelsSpy.callCount).toBe(1);
	});

	it("should not start the hashNavigation", function(){
		expect(hashNavigationSpy.start.callCount).toBe(0);
	});

	it("should not create a templates repository", function(){
		expect(TemplatesSpy.callCount).toBe(0);
	});

});