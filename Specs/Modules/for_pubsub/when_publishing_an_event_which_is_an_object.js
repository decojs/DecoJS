require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event which is an object", function(){
		
		var Event = {};
		
		it("should throw an error", function(){
			expect(function(){
				pubsub.publish(Event);
			}).toThrow();
		});
	});
});