describe("when the page has a hash location", [
	"ordnung/spa/hashNavigation"
], function(
	hashNavigation
){

	var result,
		onPageChangedSpy,
		addEventListenerSpy,
		removeEventListenerSpy,
		doc;

	beforeEach(function(){

		onPageChangedSpy = sinon.spy();
		addEventListenerSpy = sinon.spy();
		removeEventListenerSpy = sinon.spy();
		doc = {
			location: {
				href: "http://example.com/#/myPath"
			}
		};

		global = {
			addEventListener: addEventListenerSpy,
			removeEventListener: removeEventListenerSpy
		};

		result = hashNavigation.start({}, onPageChangedSpy, doc, global);
	});

	it("should return an object with a stop function", function(){
		expect(result.stop).toBeA(Function);
	});

	describe("when calling the stop function", function(){
		because(function(){
			result.stop();
		});

		it("should remove the event listener", function(){
			expect(removeEventListenerSpy.callCount).toBe(1);
			expect(removeEventListenerSpy.firstCall.args[0]).toBe("hashchange");
			expect(removeEventListenerSpy.firstCall.args[1]).toBeA(Function);
			expect(removeEventListenerSpy.firstCall.args[2]).toBe(false);
		});
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