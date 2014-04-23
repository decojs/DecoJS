describe("when creating a whenContext", [
  'deco/spa/whenContext'
], function(
  whenContext
){

  it("should be a function", function(){
    expect(whenContext).toBeA(Function);
  });

  it("should have a thisIsDestroyed function", function(){
    expect(whenContext.thisIsDestroyed).toBeA(Function);
  });

  it("should have an destroyChildContexts function", function(){
    expect(whenContext.destroyChildContexts).toBeA(Function);
  });

  describe("when calling the whenContext with no arguments", function(){

    var when;

    because(function(){
      when = whenContext();
    });

    afterEach(function(){
      whenContext.destroyChildContexts();
    });

    it("should return a function", function(){
      expect(when).toBeA(Function);
    });

    it("should have a thisIsDestroyed function", function(){
      expect(when.thisIsDestroyed).toBeA(Function);
    });

    it("should have an destroyChildContexts function", function(){
      expect(when.destroyChildContexts).toBeA(Function);
    });

  });

  describe("when calling the whenContext with one callback argument", function(){

    var result;

    because(function(){
      result = whenContext(function(){});
    });

    it("should return an object with a dont function", function(){
      expect(result.dont).toBeA(Function);
    });

  });
  

});