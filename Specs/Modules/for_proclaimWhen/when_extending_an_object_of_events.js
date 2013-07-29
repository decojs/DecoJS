describe("when extending an object of events", ["ordnung/proclaimWhen"], function(proclaimWhen){

	
	var events;
	
	beforeEach(function(){
		events = proclaimWhen.extend({
			event1: function(){},
			event2: function(param1, param2){}
		});
	});
	
	it("should produce an object with the events", function(){
		expect(events.event1).toBeDefined();
		expect(events.event2).toBeDefined();
	});
});