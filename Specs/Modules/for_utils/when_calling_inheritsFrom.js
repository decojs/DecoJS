describe("when calling inheritsFrom", [
  "deco/utils"
], function(
  utils
){
    
  function MyObject() {}

  it("should return an object which is an instance of the passed in argument", function(){
    expect(utils.inheritsFrom(MyObject)).toBeA(MyObject);
  });
});