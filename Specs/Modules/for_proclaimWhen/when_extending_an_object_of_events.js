describe("when extending an object of events", ["deco/proclaimWhen"], function(proclaimWhen){

	
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

	it("should give them all toString methods", function(){
		expect(events.event1+"").toBe("[Event event1]");
		expect(events.event2+"").toBe("[Event event2]");
	});
});