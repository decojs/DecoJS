describe("when validating the NotEmpty constraint", ["deco/qvc/constraints/NotEmpty"], function(NotEmpty){

  var constraint;
  beforeEach(function(){
    constraint = new NotEmpty({message: "hello"});
  });

  it("should have an isValid method", function(){
    expect(constraint.isValid).toBeDefined();
  });

  describe("with undefined", function(){

    it("should be invalid", function(){
      expect(constraint.isValid()).toBe(false);
    });
  });

  describe("with null", function(){

    it("should be invalid", function(){
      expect(constraint.isValid(null)).toBe(false);
    });
  });
  
  describe("with an empty string", function(){

    it("should be invalid", function(){
      expect(constraint.isValid("")).toBe(false);
    });
  });
  
  describe("with a number", function(){

    it("should be valid", function(){
      expect(constraint.isValid(0)).toBe(true);
    });
  });
  
  describe("with a string", function(){

    it("should be valid", function(){
      expect(constraint.isValid("hello")).toBe(true);
    });
  });

});