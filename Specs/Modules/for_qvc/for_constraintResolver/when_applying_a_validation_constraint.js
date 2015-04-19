describe("when applying a validation constraint", ["deco/qvc/ConstraintResolver"], function(ConstraintResolver){
  

  var constraintResolver,
    loadSpy;
    
  beforeEach(function(){
    loadSpy = sinon.stub().returns(Promise.resolve());

    constraintResolver = new ConstraintResolver({
      loadConstraints: loadSpy
    });
  });
  
  describe("for the first time", function(){
    var result;
    
    beforeEach(function(){
      
      because: {
        result = constraintResolver.applyValidationConstraints("name");
      }
      
    });
    
    it("should ask qvc for the constraint", function(){
      expect(loadSpy).toHaveBeenCalledOnce();
    });
    
    it("should return a promise", function(){
      expect(result).toBeA(Promise);
    });
  });
  
  describe("more than once", function(){
    var result1, result2;
    
    because(function(){
      result1 = constraintResolver.applyValidationConstraints("name");
      result2 = constraintResolver.applyValidationConstraints("name");
    });
    
    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy).toHaveBeenCalledOnce();
    });
    
    it("should return the same promise twice", function(){
      expect(result1).toBe(result2);
    });
  });
  
  describe("while waiting for the constraints to load", function(){
    var result;

    beforeEach(function(){
      loadSpy.returns(Promise.resolve([]));
      result = constraintResolver.applyValidationConstraints("name");

      because: {
        constraintResolver.applyValidationConstraints("name");
      }
      
    });
    
    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy).toHaveBeenCalledOnce();
    });

    it("should apply the constraint to all the validatables", function(){
      return result.then(function(fields){
        expect(fields).toEqual([]);
      });
    });
  });
});