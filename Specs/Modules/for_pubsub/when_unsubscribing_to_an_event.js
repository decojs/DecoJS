require(["ordnung/pubsub"], function(pubsub){
	describe("when unsubscribing to an event", function(){
		
		var events,
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			events = pubsub.extend({
				event1: function(){}
			})
			events.event1(eventSpy);
			
			because: {
				events.event1.dont(eventSpy);
			}
		});
		
		it("should NOT call the function when an event is published", function(){
			events.event1();
			expect(eventSpy.calledOnce).toBe(false);
		});
	});
});