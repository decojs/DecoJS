describe("when subscribing to events", [
	'ordnung/spa/whenContext',
	'ordnung/proclaimWhen'
], function(
	whenContext,
	proclaimWhen
){

	var event,
		when;

	beforeEach(function(){
		event = proclaimWhen.create(function(){});

		when = whenContext();
	});

	describe("when a child context subscribes to the event", function(){

		var spy;

		because(function(){

			spy = sinon.spy();

			when(event, spy);

			event();
		});

		it("should notify the subscriber", function(){
			expect(spy.callCount).toBe(1);
		});

		describe("when the child context is destroyed", function(){

			because(function(){
				spy.reset();

				whenContext.destroyChildContexts();

				event();
			});

			it("should no longer notify the subscriber", function(){
				expect(spy.callCount).toBe(0);
			});
		});

		describe("when the child context unsubscribes from the event", function(){

			because(function(){
				spy.reset();

				when(event).dont(spy);

				event();
			});

			it("should no longer notify the subscriber", function(){
				expect(spy.callCount).toBe(0);
			});
		});
	});

});