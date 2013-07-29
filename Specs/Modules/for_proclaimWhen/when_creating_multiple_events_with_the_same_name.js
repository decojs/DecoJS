describe("when creating multiple events with the same name", ["ordnung/proclaimWhen"], function(proclaimWhen){
	
	var events1,
		events2;
	
	beforeEach(function(){
	
		events1 = proclaimWhen.extend({
			event1: function(){}
		});
		
		events2 = proclaimWhen.extend({
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