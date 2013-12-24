describe("when starting hashNavigation", [
	"deco/spa/hashNavigation"
], function(
	hashNavigation
){

	it("should have a function which takes four arguments", function(){
		expect(hashNavigation.start.length).toBe(4);
	});

});