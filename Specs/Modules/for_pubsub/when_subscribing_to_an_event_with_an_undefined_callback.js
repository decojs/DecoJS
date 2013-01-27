require(["pubsub"], function(pubsub){
	describe("when subscribing to a event with an undefined callback", function(){
		
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
});