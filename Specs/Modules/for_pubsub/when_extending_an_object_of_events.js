require(["ordnung/pubsub"], function(pubsub){
	describe("when extending an object of events", function(){
		
		var events;
		
		beforeEach(function(){
			events = {
				event1: function(){},
				event2: function(param1, param2){}
			};

			events = pubsub.extend(events);
		});
		
		it("should produce an object with the events", function(){
			expect(events.event1).toBeDefined();
			expect(events.event2).toBeDefined();
		});
		
		it("should set the correct length for the events", function(){
			expect(events.event1.length).toBe(0));
			expect(events.event2.length).toBe(2);
		});
	});
});