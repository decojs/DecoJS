describe("when executing", {
  "deco/ajax":"Mocks/ajaxMock"
},["deco/qvc", "deco/ajax", "knockout"], function(qvc, ajaxMock, ko){

  var executable,
    beforeExecute,
    canExecute,
    invalidSpy,
    parameters,
    result;
  
  beforeEach(function(){
    beforeExecute = sinon.spy();
    canExecute = sinon.spy();
    invalidSpy = sinon.spy();
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createCommand("MyCommand", {}, {
      beforeExecute: beforeExecute,
      canExecute: canExecute,
      invalid: invalidSpy
    });
    ajaxMock.spy.reset();
    ajaxMock.respondImmediately = false;
  });
  
  describe("valid parameters", function(){
    
    because(function(){
      result = executable();
    });
      
    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecute).toHaveBeenCalled();
    });

    it("should check canExecute", function(){
      expect(canExecute).toHaveBeenCalled();
    });
    
    it("should not call invalid listener", function(){
      expect(invalidSpy).not.toHaveBeenCalled();
    });

    it("should AJAX the server", function(){
      expect(ajaxMock.spy).toHaveBeenCalled();
      var args = ajaxMock.spy.firstCall.args;
      expect(args[0]).toMatch(/command\/MyCommand$/);
    });

    describe("after complete", function(){

      var successSpy,
          completeSpy,
          errorSpy
      
      beforeEach(function(){
        
        successSpy = sinon.spy();
        completeSpy = sinon.spy();
        errorSpy = sinon.spy();        
        
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
      });
      
      it("should return false, so that it can be used in click and submit bindings", function(){
        expect(result).toBe(false);
      });

      it("should clear validation messages", function(){
        expect(parameters.name.validator.message()).toBe("");
      });
      
      it("should call success", function(){
        expect(successSpy).toHaveBeenCalled();
      });
      
      it("should call complete", function(){
        expect(completeSpy).toHaveBeenCalled();
      });
      
      it("should not call error", function(){
        expect(errorSpy).not.toHaveBeenCalled();
       });
      
      it("should not call invalid", function(){
        expect(invalidSpy).not.toHaveBeenCalled();
       });
    });
  });
  
  describe("invalid parameters", function(){
    
    var successSpy,
        completeSpy,
        errorSpy;

    because(function(){
      
      successSpy = sinon.spy();
      completeSpy = sinon.spy();
      errorSpy = sinon.spy();
      
      executable = qvc.createCommand("MyCommand", {}, {
        beforeExecute: beforeExecute,
        canExecute: canExecute,
        invalid: invalidSpy,
        success: successSpy,
        complete: completeSpy,
        error: errorSpy,
      });

      executable.validator.validate = function(){
        executable.validator.isValid(false);
      };
      
      result = executable();
    });
      
    it("should return false, so that it can be used in click and submit bindings", function(){
      expect(result).toBe(false);
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecute).toHaveBeenCalled();
    });

    it("should not call canExecute", function(){
      expect(canExecute).not.toHaveBeenCalled();
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

    var successSpy,
        completeSpy,
        errorSpy;

    beforeEach(function(){

      successSpy = sinon.spy();
      completeSpy = sinon.spy();
      errorSpy = sinon.spy();

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