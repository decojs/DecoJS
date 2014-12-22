describe("when creating an executable", {
  "deco/ajax":"Mocks/ajaxMock"
},["deco/qvc", "deco/ajax", "knockout"], function(qvc, ajaxMock, ko){
    
  var executable,
    parameters;
  
  beforeEach(function(){
    ajaxMock.responseText = "{\"parameters\": []}";
    executable = qvc.createQuery("name"+Math.random());
  });

  afterEach(function(){
    ajaxMock.spy.reset();
  });

  it("should expose the validator", function(){
    expect(executable.validator).toBeDefined();
  });
  
  describe("and setting the success callback", function(){
  
    var spy,
      successResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      spy = sinon.spy();
      
      because: {
        successResult = executable.success(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(successResult).toBe(executable);
    });
    
    it("should call the success callback on success", function(){
      expect(spy.callCount).toBe(1);
    });
    
  });
  
  describe("and setting the error callback", function(){
  
    var spy,
      errorResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      spy = sinon.spy();
      
      because: {
        errorResult = executable.error(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(errorResult).toBe(executable);
    });
    
    it("should call the error callback on error", function(){
      expect(spy).toHaveBeenCalled();
    });
    
  });
  
  describe("and setting the beforeExecute callback", function(){
  
    var spy,
      beforeExecuteResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      spy = sinon.spy();
      
      because: {
        beforeExecuteResult = executable.beforeExecute(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(beforeExecuteResult).toBe(executable);
    });
    
    it("should call the beforeExecute callback on beforeExecute", function(){
      expect(spy.callCount).toBe(1);
    });
    
  });
  
  describe("and setting the canExecute callback", function(){
  
    var spy,
      canExecuteResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      spy = sinon.spy();
      
      because: {
        canExecuteResult = executable.canExecute(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(canExecuteResult).toBe(executable);
    });
    
    it("should call the canExecute callback on canExecute", function(){
      expect(spy.callCount).toBe(1);
    });
    
  });
  
  describe("and setting the result callback", function(){
  
    var spy,
      resultResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true, result:"something"});
      spy = sinon.spy();
      
      because: {
        resultResult = executable.result(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(resultResult).toBe(executable);
    });
    
    it("should call the result callback on result", function(){
      expect(spy.callCount).toBe(1);
    });
    
  });
  
  describe("and setting the complete callback", function(){
  
    var spy,
      completeResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      spy = sinon.spy();
      
      because: {
        completeResult = executable.complete(spy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(completeResult).toBe(executable);
    });
    
    it("should call the complete callback on complete", function(){
      expect(spy.callCount).toBe(1);
    });
    
  });
  
});