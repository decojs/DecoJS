require(["ordnung/pubsub"], function(pubsub){
	describe("when extending an object of events", function(){
		
		var events;
		
		beforeEach(function(){
			events = {
				Event1: function Event1(){
				
				},
				Event2: function Event2(){
				
				}
			};

			events = pubsub.extend(events);
		});
		
		it("should give a publish function to each Event", function(){
			expect(new events.Event1().publish).toBeDefined();
		});
		
		it("should give a subscribeTo function to each Event", function(){
			expect(events.Event1.subscribeTo).toBeDefined();
		});
		
		it("should give an unsubscribeTo function to each Event", function(){
			expect(events.Event1.unsubscribeTo).toBeDefined();
		});
	});
});