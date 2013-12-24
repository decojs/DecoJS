describe("when calling startsWith", [
	"deco/utils"
], function(
	utils
){

	it("should return true when the first character matches the test", function(){
		expect(utils.startsWith("abcd", 'a')).toBe(true);
	});

	it("should return false when the first character does not match the test", function(){
		expect(utils.startsWith("abcd", 'b')).toBe(false);
	});
});