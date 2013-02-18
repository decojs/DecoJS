require(["ordnung/pubsub"], function(pubsub){
	describe("when extending an array of events", function(){
		
		var events,
			eventList;
		
		beforeEach(function(){
			eventList = [
				function Event1(){
				
				},
				function Event2(){
				
				}
			];
			events = pubsub.extend(eventList);
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