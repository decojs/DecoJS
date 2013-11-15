describe("when calling after", [
  "ordnung/utils"
], function(
  utils
){

  it("should return an empty string if the word does not contain the character", function(){
    expect(utils.after("this is a string", '#')).toBe("");
  });

  it("should return an empty string if the word ends with the character", function(){
    expect(utils.after("this is a string#", '#')).toBe("");
  });

  it("should return the string after the first occurance of the character", function(){
    expect(utils.after("this #is a #string#", '#')).toBe("is a #string#");
  });
});