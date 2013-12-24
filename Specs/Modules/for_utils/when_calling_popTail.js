describe("when calling popTail", [
	"deco/utils"
], function(
	utils
){

	it("should return a list without the last item", function(){
		expect(utils.popTail([1, 2, 3])).toEqual([1, 2]);
	});
});