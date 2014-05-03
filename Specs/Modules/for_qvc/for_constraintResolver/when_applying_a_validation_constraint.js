describe("when applying a validation constraint", ["deco/qvc/ConstraintResolver"], function(ConstraintResolver){
  

  var cr,
    loadSpy,
    validatable;
    
  beforeEach(function(){
    loadSpy = sinon.spy(function(name, callback){
      callback(name, []);
    });

    cr = new ConstraintResolver({
      loadConstraints: loadSpy
    });
    
    validatable = {
      applyConstraints: sinon.spy()
    };
  });
  
  describe("for the first time", function(){
          
    beforeEach(function(){
      
      because: {
        cr.applyValidationConstraints("name", validatable);
      }
      
    });
    
    it("should ask qvc for the constraint", function(){
      expect(loadSpy.callCount).toBe(1);
    });
    
    it("should apply the constraint to the validatable", function(){
      expect(validatable.applyConstraints.callCount).toBe(1);
    });
  });
  
  describe("more than once", function(){
    
    beforeEach(function(){
      
      because: {
        cr.applyValidationConstraints("name", validatable);
        cr.applyValidationConstraints("name", validatable);
      }
      
    });
    
    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy.callCount).toBe(1);
    });
    
    it("should apply the constraint to all the validatables", function(){
      expect(validatable.applyConstraints.callCount).toBe(2);
    });
  });
  
  describe("while waiting for the constraints to load", function(){
    
    var loadCallback;

    beforeEach(function(){
      loadSpy = sinon.spy(function(name, callback){
        loadCallback = function(){
          callback(name);
        };
      });

      cr = new ConstraintResolver({
        loadConstraints: loadSpy
      });
      
      cr.applyValidationConstraints("name", validatable);

      because: {
        cr.applyValidationConstraints("name", validatable);
        loadCallback(name, []);
      }
      
    });
    
    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy.callCount).toBe(1);
    });
    
    
    it("should apply the constraint to all the validatables", function(){
      expect(validatable.applyConstraints.callCount).toBe(2);
    });
  });
});