describe("when destroying child contexts", [
	'ordnung/spa/whenContext'
], function(
	whenContext
){

	var when;

	beforeEach(function(){
		when = whenContext();
	});

	afterEach(function(){
		whenContext.destroyChildContexts();
	});

	describe("when this context subscribes to thisIsDestroyed", function(){

		var spy;

		because(function(){
			spy = sinon.spy();

			whenContext.thisIsDestroyed(spy);

			whenContext.destroyChildContexts();
		});

		it("should not destroy itself", function(){
			expect(spy.callCount).toBe(0);
		});

	});

	describe("when a child context subscribes to thisIsDestroyed", function(){

		var spy;

		because(function(){
			spy = sinon.spy();

			when.thisIsDestroyed(spy);

			whenContext.destroyChildContexts();
		});

		it("should destroy the child context", function(){
			expect(spy.callCount).toBe(1);
		});

	});

});