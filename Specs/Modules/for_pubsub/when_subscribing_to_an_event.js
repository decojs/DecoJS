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

		describe("which has been extended", function(){
		
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
		describe("with a self object", function(){
		
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
		describe("with a string", function(){
			
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
		describe("with an undefined callback", function(){
			
			var Event = function Event(){},
				eventSpy;
			
			beforeEach(function(){
				eventSpy = undefined;
			});
			
			afterEach(function(){
			});
			
			it("should throw an error", function(){
				var thrower = function(){
					pubsub.subscribeTo(Event, eventSpy);
				};
				expect(thrower).toThrow();
			});
		});
		describe("which is undefined", function(){
				
			it("should throw an error", function(){
				var thrower = function(){
					pubsub.subscribeTo(undefined);
				};
				expect(thrower).toThrow();
			});
		});
	});
});