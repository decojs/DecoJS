describe("when the page has a hash location", [
	"ordnung/spa/hashNavigation"
], function(
	hashNavigation
){

	var result,
		onPageChangedSpy,
		addEventListenerSpy,
		doc;

	beforeEach(function(){

		onPageChangedSpy = sinon.spy();
		addEventListenerSpy = sinon.spy();
		doc = {
			location: {
				hash: "#/myPath"
			}
		};

		global = {
			addEventListener: addEventListenerSpy
		};

		result = hashNavigation({}, onPageChangedSpy, doc, global);
	});


	it("should return an object with a stop function", function(){
		expect(result.stop).toBeA(Function);
	});

	it("should call the onPageChanged event listener with the correct path", function(){
		expect(onPageChangedSpy.callCount).toBe(1);
		expect(onPageChangedSpy.firstCall.args[0]).toBe("myPath");
	});

	it("should listen to hashchange events", function(){
		expect(addEventListenerSpy.callCount).toBe(1);
		expect(addEventListenerSpy.firstCall.args[0]).toBe("hashchange");
		expect(addEventListenerSpy.firstCall.args[1]).toBeA(Function);
		expect(addEventListenerSpy.firstCall.args[2]).toBe(false);
	});
	
});