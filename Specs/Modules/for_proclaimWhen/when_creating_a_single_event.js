describe("when creating a single event", ["ordnung/proclaimWhen"], function(proclaimWhen){
	
	var spy,
		event1;

	beforeEach(function(){
		spy = sinon.spy();
	});
	
	describe("without a name", function(){
				
		beforeEach(function(){
		
			event1 = proclaimWhen.create(function(){});
			event1(spy);
			
			because: {
				event1();
			}
			
		});
	
		it("should have a toString method", function(){
			expect(event1+"").toBe("[Event anonymous event]");
		});
	
		it("should trigger when the event is published", function(){
			expect(spy.callCount).toBe(1);
		});
	});
	
	describe("with a name", function(){
		
		beforeEach(function(){
		
			event1 = proclaimWhen.create("my event", function(){});
			event1(spy);
			
			because: {
				event1();
			}
			
		});
	
		it("should have a toString method", function(){
			expect(event1+"").toBe("[Event my event]");
		});
	
		it("should trigger when the event is published", function(){
			expect(spy.callCount).toBe(1);
		});
	});
});