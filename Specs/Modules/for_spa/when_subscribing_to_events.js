describe("when subscribing to events", [
	"ordnung/spa",
	"Given/an_element",
	"Given/an_event"
], function(
	spa,
	an_element,
	an_event
){

	var event,
		react;

	beforeEach(function(done){

		var doc = an_element.withAViewModel("dummyVM");

		event = an_event.withNoParams();
		react = sinon.spy();

		define("dummyVM", [], function(){
			return function DummyVM(model, when){
				when(event, react);
			};
		});


		spa.start({}, doc).then(done);
	});

	afterEach(function(){
		
	});

	describe("when the event is triggered", function(){

		beforeEach(function(){
			event();
		});

		it("should react when the event is triggered", function(){
			expect(react.callCount).toBe(1);
		});
	});


});