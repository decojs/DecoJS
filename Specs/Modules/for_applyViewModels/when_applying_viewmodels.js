describe("when applying viewmodels", [
	"ordnung/applyViewModels",
	"Given/an_element"
], function(
	applyViewModels,
	an_element
){


	function functionName(m){
		return m.name || m.toString().match(/function\s+([^(]+)/)[1];
	}

	var dummyVM,
		subscribe,
		model = {a: true};

	beforeEach(function(done){

		subscribe = sinon.spy();

		dummyVM = sinon.spy();

		define("dummyVM", [], function(){
			return function DummyVM(){
				dummyVM(this, arguments);
			};
		});
		
		var elm = an_element.withAViewModel("dummyVM", model);

		because: {
			applyViewModels(elm, subscribe).then(done);
		}
	});

	it("should find all the viewmodels in the dom tree", function(){
		expect(dummyVM.callCount).toBe(1);
	});

	it("should call the viewmodule as a constructor", function(){
		expect(functionName(dummyVM.firstCall.args[0].constructor)).toBe("DummyVM");
	});

	it("should call the viewmodule with the model as the first argument", function(){
		expect(dummyVM.firstCall.args[1][0]).toEqual(model);
	});

	it("should call the viewmodule with the subscribe function as the second argument", function(){
		expect(dummyVM.firstCall.args[1][1]).toEqual(subscribe);
	});
});