describe("when executing", {
  "deco/ajax":"Mocks/ajaxMock"
},["deco/qvc", "deco/ajax", "knockout"], function(qvc, ajaxMock, ko){

  var executable,
    beforeExecute,
    canExecute,
    invalid,
    parameters;
  
  beforeEach(function(){
    beforeExecute = sinon.spy();
    canExecute = sinon.spy();
    invalid = sinon.spy();
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createCommand("MyCommand", {}, {
      beforeExecute: beforeExecute,
      canExecute: canExecute,
      invalid: invalid
    });
    ajaxMock.spy.reset();
    ajaxMock.responseText = "{}"
  });
  
  describe("valid parameters", function(){
    
    because(function(){
      executable();
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecute.callCount).toBe(1);
    });

    it("should check canExecute", function(){
      expect(canExecute.callCount).toBe(1);
    });
    
    it("should not call invalid listener", function(){
      expect(invalid.callCount).toBe(0);
    });

    it("should AJAX the server", function(){
      expect(ajaxMock.spy.callCount).toBe(1);
      var args = ajaxMock.spy.firstCall.args;
      expect(args[0]).toMatch(/command\/MyCommand$/);
    });

    describe("after complete", function(){

      beforeEach(function(){
        parameters = {
          name: ko.observable()
        }
        ajaxMock.responseText = "{\"parameters\": []}";
        executable = qvc.createCommand(
          "MyCommand",
          parameters,
          {
            beforeExecute: beforeExecute,
            canExecute: canExecute,
            complete: function(){
              parameters.name.validator.message("hello");
            }
          }
        );
        ajaxMock.responseText = "{\"success\":true}"
        executable();
      });

      it("should clear validation messages", function(){
        expect(parameters.name.validator.message()).toBe("");
      });
    });
  });
  
  describe("invalid parameters", function(){
    
    because(function(){
      executable.validator.validate = function(){
        executable.validator.isValid(false);
      };
      
      executable();
    });
  
    it("should call beforeExecute", function(){
      expect(beforeExecute.callCount).toBe(1);
    });

    it("should not call canExecute", function(){
      expect(canExecute.callCount).toBe(0);
    });
    
    it("should call invalid listener", function(){
      expect(invalid.callCount).toBe(1);
    });
    
  });
});