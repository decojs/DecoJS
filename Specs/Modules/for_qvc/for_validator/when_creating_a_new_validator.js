describe("when creating a new validator", { 
  "deco/qvc/Constraint": "Mocks/ConstraintMock"
},["knockout", "deco/qvc/Validator"], function(ko, Validator){

  var observable,
    validator;
  
  beforeEach(function(){
    observable = ko.observable();
    validator = new Validator(observable, {name:"name", path:"some.name", executableName:"SomeExecutable"});
  });
  
  it("should be valid by default", function(){
    expect(validator.isValid()).toBe(true);
  });
  
  it("should have an empty message", function(){
    expect(validator.message()).toBe("");
  });
  
  it("should have a name", function(){
    expect(validator.name).toBe("name");
  });
  
  it("should have a path", function(){
    expect(validator.path).toBe("some.name");
  });
  
  it("should belong to an executable", function(){
    expect(validator.executableName).toBe("SomeExecutable");
  });
  
  it("should make it easy to see if the observable is valid", function(){
    expect(observable.isValid).toBeA(Function);
  });
  
  describe("when reseting the validator", function(){
      
    beforeEach(function(){
      observable = ko.observable();
      
      validator = new Validator(observable);
      validator.isValid(false);
      validator.message("hello");
      validator.reset();
    });
  
    it("should be valid by default", function(){
      expect(validator.isValid()).toBe(true);
    });
    
    it("should have an empty message", function(){
      expect(validator.message()).toBe("");
    });
    
    it("should be easy to see that it is valid by default", function(){
      expect(observable.isValid()).toBe(true);
    });
  });
  
  describe("when setting constraints", function(){
    
    var constraint = {name:"NotEmpty", attributes:{}};
    
    beforeEach(function(){
      validator = new Validator(ko.observable());
      validator.setConstraints([constraint]);
    });
  
    it("should add it to the list of constraints", function(){
      expect(validator.constraints.length).toBe(1);
    });
    
    it("should create a constraint object", function(){
      expect(validator.constraints[0].name).toBe(constraint.name);
      expect(validator.constraints[0].attributes).toBe(constraint.attributes);
    });
  });
});