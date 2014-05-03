describe("when executing", {
  "deco/ajax":"Mocks/ajaxMock"
},["deco/qvc", "deco/ajax", "knockout"], function(qvc, ajaxMock, ko){

  var executable,
    beforeExecute,
    canExecute,
    parameters;
  
  beforeEach(function(){
    beforeExecute = sinon.spy();
    canExecute = sinon.spy();
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createCommand("MyCommand", {}, {
      beforeExecute: beforeExecute,
      canExecute: canExecute
    });
    ajaxMock.spy.reset();
    ajaxMock.responseText = "{}"
    executable();
  });
  
  it("should call beforeExecute", function(){
    expect(beforeExecute.callCount).toBe(1);
  });
  
  it("should check canExecute", function(){
    expect(canExecute.callCount).toBe(1);
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