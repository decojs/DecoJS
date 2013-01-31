require(["ordnung/pubsub"], function(pubsub){
	describe("when unsubscribing to an event", function(){
		
		var Event = function Event(){},
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.subscribeTo(Event, eventSpy);
			
			(function because(){
				pubsub.unsubscribeTo(Event, eventSpy);
			})();
		});
		
		it("should NOT call the function when an event is published", function(){
			pubsub.publish(new Event());
			expect(eventSpy.calledOnce).toBe(false);
		});
	});
});