require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event", function(){

		var Event,
			eventSpy;

		describe("which is an object", function(){
			
			beforeEach(function(){
				Event = {};
			});

			it("should throw an error", function(){
				expect(function(){
					pubsub.publish(Event);
				}).toThrow();
			});
		});
		describe("with multiple properties", function(){
			
			beforeEach(function(){
				Event = function Event(name, title, prop){
					this.name = name;
					this.title = title;
					this.prop = prop;
				}

				eventSpy = sinon.stub();
				pubsub.subscribeTo(Event, eventSpy);
				
				because: {
					pubsub.publish(new Event("name", "title", "property"));
				}
			});
			
			afterEach(function(){
				pubsub.unsubscribeTo(Event, eventSpy);
			});
			
			it("should call the subscriber with 3 arguments", function(){
				expect(eventSpy.callCount).toBe(1);
				expect(eventSpy.calledWithExactly("name", "title", "property")).toBe(true);
				expect(eventSpy.getCall(0).args[0]).toBe("name");
				expect(eventSpy.getCall(0).args[1]).toBe("title");
				expect(eventSpy.getCall(0).args[2]).toBe("property");
			});
		});
		describe("without a name", function(){
			
			beforeEach(function(){
				Event = function (){};
			});
			it("should throw an error", function(){
				expect(function(){
					pubsub.publish(new Event());
				}).toThrow();
			});
		});
	});
});