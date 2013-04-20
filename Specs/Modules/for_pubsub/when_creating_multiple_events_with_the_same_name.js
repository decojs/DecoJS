require(["ordnung/pubsub"], function(pubsub){
	describe("when creating multiple events with the same name", function(){
		
		var events1,
			events2;
		
		beforeEach(function(){
		
			events1 = pubsub.extend({
				event1: function(){}
			});
			
			events2 = pubsub.extend({
				event1:function(){}
			});
			
		});
		
		describe("when subscribing to one event", function(){
			
			var spy;
			
			beforeEach(function(){
			
				spy = sinon.spy();
				events1.event1(spy);
				
				because: {
					events2.event1();
				}
				
			});
		
			it("should not trigger when the other event is published", function(){
				expect(spy.callCount).toBe(0);
			});
		});
	});
});