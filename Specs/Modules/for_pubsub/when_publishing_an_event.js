require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event", function(){

		var events,
			eventSpy;

		describe("with multiple properties", function(){
			
			beforeEach(function(){
				events = pubsub.extend({
					event1: function(name, title, prop){}
				});
				eventSpy = sinon.stub();
				events.event1(eventSpy);
				
				because: {
					events.event1("name", "title", "property");
				}
			});
			
			afterEach(function(){
				events.event1.dont(eventSpy);
			});
			
			it("should call the subscriber with 3 arguments", function(){
				expect(eventSpy.callCount).toBe(1);
				expect(eventSpy.calledWithExactly("name", "title", "property")).toBe(true);
				expect(eventSpy.getCall(0).args[0]).toBe("name");
				expect(eventSpy.getCall(0).args[1]).toBe("title");
				expect(eventSpy.getCall(0).args[2]).toBe("property");
			});
		});
	});
});