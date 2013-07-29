moquire(["ordnung/load"], function(load){


	function functionName(m){
		return m.name || m.toString().match(/function\s+([^(]+)/)[1];
	}

	describe("when loading viewmodels", function(){

		var dummyVM;

		new Async(this).beforeEach(function(done){

			var elm = document.createElement("div");
			var div = document.createElement("div");
			div.setAttribute("data-viewmodel", "dummyVM");
			elm.appendChild(div);

			dummyVM = sinon.spy();

			define("dummyVM", [], function(){
				return function DummyVM(){
					dummyVM(this);
					done();
				};
			});

			because: {
				load(elm);
			}
		});

		it("should find all the viewmodels in the dom tree", function(){
			expect(dummyVM.callCount).toBe(1);
		});

		it("should call the viewmodule as a constructor", function(){
			expect(functionName(dummyVM.getCall(0).args[0].constructor)).toBe("DummyVM");
		});
	});

});