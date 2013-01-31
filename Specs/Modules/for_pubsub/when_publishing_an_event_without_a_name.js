require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event without a name", function(){
		
		var Event = function (){};
		
		it("should throw an error", function(){
			expect(function(){
				pubsub.publish(new Event());
			}).toThrow();
		});
	});
});