describe("when calling endsWith", [
	"ordnung/utils"
], function(
	utils
){

	it("should return true when the last character matches the test", function(){
		expect(utils.endsWith("abcd", 'd')).toBe(true);
	});

	it("should return false when the last character does not match the test", function(){
		expect(utils.endsWith("abcd", 'b')).toBe(false);
	});
});