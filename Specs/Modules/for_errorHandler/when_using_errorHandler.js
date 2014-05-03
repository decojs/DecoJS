describe("when using errorHandler", [
  "deco/errorHandler"
], function(
  errorHandler
){

  it("should have an onError method", function(){
    expect(errorHandler.onError).toBeDefined();
  });

  it("should have an onError method which takes one argument", function(){
    expect(errorHandler.onError.length).toBe(1);
  });

});