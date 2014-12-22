describe("when onError is called", [
  'deco/qvc/Executable'
], function(
  Executable
){
  
  var executable,
    loadConstraintsSpy,
    errorSpy,
    invalidSpy;

  beforeEach(function(){

    loadConstraintsSpy = sinon.spy();

    errorSpy = sinon.spy();
    invalidSpy = sinon.spy();

    executable = new Executable("blabla", Executable.Command, {}, {error: errorSpy, invalid: invalidSpy}, {loadConstraints: loadConstraintsSpy});
    
    sinon.spy(executable, 'applyViolations');
  });

  describe("with violations", function(){


    because(function(){
      executable.result.violations = [{fieldName:'', message:'oh noes'}];
      
      executable.onError();
    });

    it("should not set hasError to true", function(){
      expect(executable.hasError()).toBe(false);
    });

    it("should call the invalid callback", function(){
      expect(invalidSpy).toHaveBeenCalled();
    });

    it("should not call the error callback", function(){
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should call applyViolations", function(){
      expect(executable.applyViolations).toHaveBeenCalled();
    });
    
    it("should be invalid", function(){
      expect(executable.isValid()).toBe(false);
    });

  });

  describe("without violations", function(){


    because(function(){
      executable.result.violations = null;

      executable.onError();
    });

    it("should set hasError to true", function(){
      expect(executable.hasError()).toBe(true);
    });

    it("should not call the invalid callback", function(){
      expect(invalidSpy).not.toHaveBeenCalled();
    });

    it("should set hasError to true", function(){
      expect(errorSpy).toHaveBeenCalled();
    });

    it("should not call applyViolations", function(){
      expect(executable.applyViolations).not.toHaveBeenCalled();
    });
    
    it("should not be invalid", function(){
      expect(executable.isValid()).not.toBe(false);
    });
  });

});