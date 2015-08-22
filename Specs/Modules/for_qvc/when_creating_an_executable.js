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
  
    var successSpy,
      successResult;
  
    beforeEach(function(done){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      successSpy = sinon.spy();
      
      because: {
        successResult = executable.success(successSpy);
        executable();
        setTimeout(done,1);
      }
    });
    
    it("should return the executable", function(){
      expect(successResult).toBe(executable);
    });
    
    it("should call the success callback on success", function(){
      expect(successSpy).toHaveBeenCalledOnce();
    });
    
  });
  
  describe("and setting the error callback", function(){
  
    var errorSpy,
      errorResult;
  
    beforeEach(function(done){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      errorSpy = sinon.spy();
      
      because: {
        errorResult = executable.error(errorSpy);
        executable();
        setTimeout(done,1);
      }
    });
    
    it("should return the executable", function(){
      expect(errorResult).toBe(executable);
    });
    
    it("should call the error callback on error", function(){
      expect(errorSpy).toHaveBeenCalledOnce();
    });
    
  });
  
  describe("and setting the beforeExecute callback", function(){
  
    var beforeExecuteSpy,
      beforeExecuteResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      beforeExecuteSpy = sinon.spy();
      
      because: {
        beforeExecuteResult = executable.beforeExecute(beforeExecuteSpy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(beforeExecuteResult).toBe(executable);
    });
    
    it("should call the beforeExecute callback on beforeExecute", function(){
      expect(beforeExecuteSpy).toHaveBeenCalledOnce();
    });
    
  });
  
  describe("and setting the canExecute callback", function(){
  
    var canExecuteSpy,
      canExecuteResult;
  
    beforeEach(function(){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:false});
      canExecuteSpy = sinon.spy();
      
      because: {
        canExecuteResult = executable.canExecute(canExecuteSpy);
        executable();
      }
    });
    
    it("should return the executable", function(){
      expect(canExecuteResult).toBe(executable);
    });
    
    it("should call the canExecute callback on canExecute", function(){
      expect(canExecuteSpy).toHaveBeenCalledOnce();
    });
    
  });
  
  describe("and setting the result callback", function(){
  
    var resultSpy,
      resultResult;
  
    beforeEach(function(done){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true, result:"something"});
      resultSpy = sinon.spy();
      
      because: {
        resultResult = executable.result(resultSpy);
        executable();
        setTimeout(done,1);
      }
    });
    
    it("should return the executable", function(){
      expect(resultResult).toBe(executable);
    });
    
    it("should call the result callback on result", function(){
      expect(resultSpy).toHaveBeenCalledOnce();
    });
    
  });
  
  describe("and setting the complete callback", function(){
  
    var completeSpy,
      completeResult;
  
    beforeEach(function(done){
      ajaxMock.spy.reset();
      ajaxMock.responseText = JSON.stringify({success:true});
      completeSpy = sinon.spy();
      
      because: {
        completeResult = executable.complete(completeSpy);
        executable();
        setTimeout(done,1);
      }
    });
    
    it("should return the executable", function(){
      expect(completeResult).toBe(executable);
    });
    
    it("should call the complete callback on complete", function(){
      expect(completeSpy).toHaveBeenCalledOnce();
    });
    
  });
  
});