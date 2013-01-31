require(["ordnung/pubsub"], function(pubsub){
	describe("when subscribing to a event", function(){
		
		var Event = function Event(){},
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.subscribeTo(Event, eventSpy);
		});
		
		afterEach(function(){
			pubsub.unsubscribeTo(Event, eventSpy);
		});
		
		it("should call the function when a event is published", function(){
			pubsub.publish(new Event());
			expect(eventSpy.calledOnce).toBe(true);
		});
	});
});