require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event with multiple properties", function(){
		
		var Event = function Event(name, title, prop){
			this.name = name;
			this.title = title;
			this.prop = prop;
		},
			eventSpy;
		
		beforeEach(function(){
			eventSpy = sinon.stub();
			pubsub.subscribeTo(Event, eventSpy);
			
			(function because(){
				pubsub.publish(new Event("name", "title", "property"));
			})();
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
});