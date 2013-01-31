require(["ordnung/pubsub"], function(pubsub){
	describe("when subscribing to an event with a self object", function(){
		
		var Event = function Event(){},
			object = {
				called: 0,
				callback: function(){
					this.called++;
				}
			};
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.subscribeTo(Event, object.callback, object);
		});
		
		afterEach(function(){
			pubsub.unsubscribeTo(Event, object.callback, object);
		});
		
		it("should call the function when an event is published", function(){
			pubsub.publish(new Event());
			expect(object.called).toBe(1);
		});
	});
});