require(["ordnung/pubsub"], function(pubsub){
	describe("when publishing an event", function(){

		var when,
			proclaim,
			spyOnIt;

		describe("with multiple properties", function(){
			
			beforeEach(function(){
				when = proclaim = pubsub.extend({
					somethingHappens: function(name, title, prop){}
				});
				spyOnIt = sinon.stub();
				when.somethingHappens(spyOnIt);
				
				because: {
					proclaim.somethingHappens("name", "title", "property");
				}
			});
			
			afterEach(function(){
				when.somethingHappens.dont(spyOnIt);
			});
			
			it("should call the subscriber with 3 arguments", function(){
				expect(spyOnIt.callCount).toBe(1);
				expect(spyOnIt.calledWithExactly("name", "title", "property")).toBe(true);
				expect(spyOnIt.getCall(0).args[0]).toBe("name");
				expect(spyOnIt.getCall(0).args[1]).toBe("title");
				expect(spyOnIt.getCall(0).args[2]).toBe("property");
			});
		});
	});
});