require(["ordnung/pubsub"], function(pubsub){
	describe("when subscribing to a event", function(){
		
		var events,
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			events = pubsub.extend({
				event1: function (){}
			});
			events.event1(eventSpy);
		});
		
		afterEach(function(){
			events.event1.dont(eventSpy);
		});
		
		it("should call the function when a event is published", function(){
			events.event1();
			expect(eventSpy.calledOnce).toBe(true);
		});

		describe("with an undefined callback", function(){
						
			beforeEach(function(){
				eventSpy = undefined;
			});
			
			afterEach(function(){
			});
			
			it("should throw an error", function(){
				var thrower = function(){
					events.event1(eventSpy);
				};
				expect(thrower).toThrow();
			});
		});
	});
});