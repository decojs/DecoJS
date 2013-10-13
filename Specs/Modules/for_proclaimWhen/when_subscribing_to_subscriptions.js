describe("when subscribing to subscriptions", ["ordnung/proclaimWhen"], function(proclaimWhen){
	
	var when,
		spy1,
		spy2,
		subscriber;
	
	beforeEach(function(){

		subscriber = function(){};

		spy1 = sinon.spy();
		spy2 = sinon.spy();

		when = proclaimWhen.extend({
			event1: function(){}
		});
		
	});
	
	it("should be notified when someone subscribes", function(){
		when.event1.isSubscribedTo(spy1);
		when.event1(subscriber);
		expect(spy1.callCount).toBe(1);
	});
	
	it("should not be notified when someone subscribes a second time", function(){
		when.event1.isSubscribedTo(spy1);
		when.event1(subscriber);
		when.event1(subscriber);
		expect(spy1.callCount).toBe(1);
	});
	
	it("should not be notified if unsubscribing from subscriptions", function(){
		when.event1.isSubscribedTo(spy1);
		when.event1.isSubscribedTo.dont(spy1);
		when.event1(subscriber);
		expect(spy1.callCount).toBe(0);
	});

	describe("and unsubscriptions", function(){
		because(function(){
			when.event1(subscriber);
			when.event1.isUnsubscribedFrom(spy2);
			when.event1.dont(subscriber);
		});
	
		it("should be notified when someone unsubscribes", function(){
			expect(spy2.callCount).toBe(1);
		});
	});

	
	it("should not be notified if unsubscribing from unsubscriptions", function(){
		when.event1(subscriber);
		when.event1.isUnsubscribedFrom(spy1);
		when.event1.isUnsubscribedFrom.dont(spy1);
		when.event1.dont(subscriber);
		expect(spy1.callCount).toBe(0);
	});

	describe("and an unsubscribed event unsubscribes", function(){
		because(function(){

			//subscriber is not subscribed to event1
			when.event1.isUnsubscribedFrom(spy2);
			when.event1.dont(subscriber);
		});
	
		it("should not be notified", function(){
			expect(spy2.callCount).toBe(0);
		});
	});
	
});