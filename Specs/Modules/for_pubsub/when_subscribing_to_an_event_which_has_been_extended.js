require(["ordnung/pubsub"], function(pubsub){
	describe("when subscribing to an event which has been extended", function(){
		
		var events = {
				Event: function Event(){}
			},
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.extend(events);
			events.Event.subscribeTo(eventSpy);
		});
		
		afterEach(function(){
			events.Event.unsubscribeTo(eventSpy);
		});
		
		it("should call the function when an event is published", function(){
			new events.Event().publish();
			expect(eventSpy.calledOnce).toBe(true);
		});
	});
});