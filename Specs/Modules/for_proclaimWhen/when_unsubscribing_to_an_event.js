moquire(["ordnung/proclaimWhen"], function(proclaimWhen){
	describe("when unsubscribing to an event", function(){
		
		var when,
			proclaim,
			spyOnIt;
		
		beforeEach(function(){
			spyOnIt = sinon.stub();
			when = proclaim = proclaimWhen.extend({
				somethingHappens: function(){}
			})
			when.somethingHappens(spyOnIt);
			
			because: {
				when.somethingHappens.dont(spyOnIt);
			}
		});
		
		it("should NOT call the function when an event is published", function(){
			proclaim.somethingHappens();
			expect(spyOnIt.calledOnce).toBe(false);
		});
	});
});