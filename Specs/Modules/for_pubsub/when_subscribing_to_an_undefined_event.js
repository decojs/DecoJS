require(["pubsub"], function(pubsub){
	describe("when subscribing to an undefined event", function(){
				
		it("should throw an error", function(){
			var thrower = function(){
				pubsub.subscribeTo(undefined);
			};
			expect(thrower).toThrow();
		});
	});
});