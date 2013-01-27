require(["pubsub"], function(pubsub){
	describe("when subscribing to an event with a string", function(){
		
		var Event = function Event(){},
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.subscribeTo("Event", eventSpy);
		});
		
		afterEach(function(){
			pubsub.unsubscribeTo("Event", eventSpy);
		});
		
		it("should call the function when an event is published", function(){
			pubsub.publish(new Event());
			expect(eventSpy.calledOnce).toBe(true);
		});
	});
});