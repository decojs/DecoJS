describe("when the hashchange event listener is called", [
	"ordnung/spa/hashNavigation"
], function(
	hashNavigation
){

	var result,
		onPageChangedSpy,
		replaceSpy,
		doc,
		onHashChange;

	beforeEach(function(){

		onPageChangedSpy = sinon.spy();
		replaceSpy = sinon.spy();

		config = {
			index: "home"
		};

		doc = {
			location: {
				hash: "#/myPath/home",
				replace: replaceSpy
			}
		};

		global = {
			addEventListener: function(event, listener){
				onHashChange = listener;
			}
		};

		result = hashNavigation.start(config, onPageChangedSpy, doc, global);
	});

	describe("with a path starting with /", function(){

		because(function(){
			onPageChangedSpy.reset();
			doc.location.hash = "#/newPath";
			onHashChange();
		});

		it("should call onPageChanged with the new path", function(){
			expect(onPageChangedSpy.callCount).toBe(1);
			expect(onPageChangedSpy.firstCall.args[0]).toBe("newPath");
		});
	});

	describe("with a path not starting with /", function(){

		because(function(){
			replaceSpy.reset();
			doc.location.hash = "#newPath";
			onHashChange();
		});

		it("should call document.location.replace with the new path", function(){
			expect(replaceSpy.callCount).toBe(1);
			expect(replaceSpy.firstCall.args[0]).toBe("#/myPath/newPath");
		});
	});

	describe("with a path ends with /", function(){

		because(function(){
			replaceSpy.reset();
			doc.location.hash = "#/newPath/";
			onHashChange();
		});

		it("should call document.location.replace with the new path, ending with index", function(){
			expect(replaceSpy.callCount).toBe(1);
			expect(replaceSpy.firstCall.args[0]).toBe("#/newPath/home");
		});
	});
});