describe("when unsubscribing from an event", ["ordnung/proclaimWhen"], function(proclaimWhen){

	
	var when,
		proclaim,
		spyOnIt;
	
	beforeEach(function(){
		spyOnIt = sinon.spy();
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

	describe("multiple times", function(){

		var spyOnItAgain = sinon.spy();

		beforeEach(function(){
			when.somethingHappens(spyOnItAgain);
			because:{
				when.somethingHappens.dont(spyOnIt);
			}
		});

		it("should not do anything", function(){
			when.somethingHappens.dont(spyOnIt);
		});

		it("should not remove other event listeners", function(){
			proclaim.somethingHappens();
			expect(spyOnItAgain.calledOnce).toBe(true);
		});	
	});
});