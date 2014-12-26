describe("when calling trim", [
  "deco/utils"
], function(
  utils
){

  it("should trim characters from the start", function(){
    expect(utils.trim("aaathis is a string", 'a')).toBe("this is a string");
  });

  it("should trim characters from the end", function(){
    expect(utils.trim("this is a stringbbbb", 'b')).toBe("this is a string");
  });

  it("should trim characters from the start and end", function(){
    expect(utils.trim("bbbbthis is a stringbbbb", 'b')).toBe("this is a string");
  });

  it("should not trim characters which don't match", function(){
    expect(utils.trim("this is a string", 'b')).toBe("this is a string");
  });
});