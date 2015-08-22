describe("when executing", {
  "deco/ajax":"Mocks/ajaxMock"
},["deco/qvc", "deco/ajax", "knockout"], function(qvc, ajaxMock, ko){

  var executable,
    successSpy,
    completeSpy,
    errorSpy,
    beforeExecuteSpy,
    canExecuteSpy,
    invalidSpy,
    parameters,
    result;
  
  beforeEach(function(){
    beforeExecuteSpy = sinon.spy();
    canExecuteSpy = sinon.spy();
    invalidSpy = sinon.spy();
    successSpy = sinon.spy();
    completeSpy = sinon.spy();
    errorSpy = sinon.spy();
  });
  
  describe("with valid parameters", function(){
    
    beforeEach(function(){
      ajaxMock.responseText = "{\"parameters\": []}";
      executable = qvc.createCommand("MyCommand", {}, {
        beforeExecute: beforeExecuteSpy,
        canExecute: canExecuteSpy,
        invalid: invalidSpy
      });
      ajaxMock.spy.reset();
      ajaxMock.respondImmediately = false;
    
      result = executable();
    });
      
    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecuteSpy).toHaveBeenCalled();
    });

    it("should check canExecute", function(){
      expect(canExecuteSpy).toHaveBeenCalled();
    });
    
    it("should not call invalid listener", function(){
      expect(invalidSpy).not.toHaveBeenCalled();
    });

    it("should AJAX the server", function(){
      expect(ajaxMock.spy).toHaveBeenCalled();
      var args = ajaxMock.spy.firstCall.args;
      expect(args[0]).toMatch(/command\/MyCommand$/);
    });
  });

  describe("and successfully completing", function(){

    beforeEach(function(done){

      parameters = {
        name: ko.observable()
      }

      ajaxMock.responseText = "{\"parameters\": []}";

      executable = qvc.createCommand(
        "MyCommand",
        parameters,
        {
          success: successSpy,
          complete: completeSpy,
          error: errorSpy,
          invalid: invalidSpy
        }
      );
      ajaxMock.responseText = "{\"success\":true}"
      ajaxMock.respondImmediately = true;
      parameters.name.validator.message("hello");

      result = executable();
      setTimeout(done, 1);
    });

    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should clear validation messages", function(){
      expect(parameters.name.validator.message()).toBe("");
    });

    it("should call success", function(){
      expect(successSpy).toHaveBeenCalledOnce();
    });

    it("should call complete", function(){
      expect(completeSpy).toHaveBeenCalledOnce();
    });

    it("should not call error", function(){
      expect(errorSpy).not.toHaveBeenCalled();
     });

    it("should not call invalid", function(){
      expect(invalidSpy).not.toHaveBeenCalled();
     });
  });
  
  describe("with invalid parameters", function(){

    beforeEach(function(done){      
      executable = qvc.createCommand("MyCommand", {}, {
        beforeExecute: beforeExecuteSpy,
        canExecute: canExecuteSpy,
        invalid: invalidSpy,
        success: successSpy,
        complete: completeSpy,
        error: errorSpy,
      });

      executable.validator.validate = function(){
        executable.validator.isValid(false);
      };
      
      result = executable();
      setTimeout(done, 1);
    });
      
    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecuteSpy).toHaveBeenCalled();
    });

    it("should not call canExecute", function(){
      expect(canExecuteSpy).not.toHaveBeenCalled();
    });
    
    it("should call invalid listener", function(){
      expect(invalidSpy).toHaveBeenCalled();
    });
      
    it("should not call success", function(){
      expect(successSpy).not.toHaveBeenCalled();
    });

    it("should not call complete", function(){
      expect(completeSpy).not.toHaveBeenCalled();
    });

    it("should not call error", function(){
      expect(errorSpy).not.toHaveBeenCalled();
     });

    it("should call invalid", function(){
      expect(invalidSpy).toHaveBeenCalled();
     });    
  });

  describe("with invalid result from the server", function(){

    beforeEach(function(done){

      parameters = {
        name: ko.observable()
      }

      ajaxMock.responseText = "{\"parameters\": []}";

      executable = qvc.createCommand(
        "MyCommand",
        parameters,
        {
          success: successSpy,
          complete: completeSpy,
          error: errorSpy,
          invalid: invalidSpy
        }
      );
      ajaxMock.responseText = "{\"success\":false, \"violations\":[{}]}"
      ajaxMock.respondImmediately = true;

      result = executable();
      setTimeout(done, 1);
    });
      
    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });

    it("should clear validation messages", function(){
      expect(parameters.name.validator.message()).toBe("");
    });

    it("should not call success", function(){
      expect(successSpy).not.toHaveBeenCalled();
    });

    it("should call complete", function(){
      expect(completeSpy).toHaveBeenCalled();
    });

    it("should not call error", function(){
      expect(errorSpy).not.toHaveBeenCalled();
     });

    it("should call invalid", function(){
      expect(invalidSpy).toHaveBeenCalled();
     });
  });
});