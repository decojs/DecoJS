describe("when calling arrayToObject", [
  "deco/utils"
], function(
  utils
){

  var array = [
    {key:1, value:"abc"},
    {key:3, value:"def"},
    {key:2, value:"bcd"}
  ];
  var result,
    spy;

  because(function(){
    spy = sinon.spy();
    result = utils.arrayToObject(array, spy);
  });

  it("should call the spy three times", function(){
    expect(spy.callCount).toBe(3);
  });

  it("should return an object", function(){
    expect(result).toBeAn(Object);
  });

});