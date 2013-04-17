require(["ordnung/pubsub"], function(pubsub){
	describe("when subscribing to a event", function(){
		
		var when,
			proclaim,
			spyOnIt;
		
		beforeEach(function(){
			spyOnIt = sinon.stub();
			when = proclaim = pubsub.extend({
				somethingHappens: function (){}
			});
			when.somethingHappens(spyOnIt);
		});
		
		afterEach(function(){
			when.somethingHappens.dont(spyOnIt);
		});
		
		it("should call the function when a event is published", function(){
			proclaim.somethingHappens();
			expect(spyOnIt.calledOnce).toBe(true);
		});
	});
});