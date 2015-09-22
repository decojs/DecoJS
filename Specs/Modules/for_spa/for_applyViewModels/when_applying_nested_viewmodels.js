describe("when applying nested viewmodels", [
  "deco/spa/applyViewModels",
  "Given/an_element",
  "knockout"
], function(
  applyViewModels,
  an_element,
   ko
){

  var dummyVM,
    nestedVM,
    subscribe,
    model = {a: true},
    nestedPromise,
    parentContext,
    subWhenContext,
    originalRequire,
    DummyVM;
  

  beforeEach(function(){
    
    originalRequire = require;
    require = sinon.stub();

    subWhenContext = sinon.spy();
    parentContext = sinon.stub().returns(subWhenContext);
    parentContext.destroyChildContexts = sinon.spy();
    subscribe = sinon.stub().returns(sinon.stub().returns(parentContext));
    
    
    DummyVM = function DummyVM(){
      dummyVM.apply(this, arguments);
      this.value = "dummyText";
    }
    
    dummyVM = sinon.spy();
    nestedVM = sinon.spy();

    require.withArgs(['dummyVM']).callsArgWith(1, DummyVM);
  });

  afterEach(function(){
    require = originalRequire;
  });

  describe("before the nested view model has loaded", function(){
    
    because(function(done){
      require.withArgs(['nestedVM']).callsArgWith(1, function(){});
      
      var elm = an_element.withNestedViewModel("dummyVM", "nestedVM");

      applyViewModels(elm, subscribe).then(done);
    });
    
    it("should find only the top level viewmodels in the dom tree", function(){
      expect(dummyVM).toHaveBeenCalled();
    });

    it("should not find the nested viewmodels", function(){
      expect(nestedVM).not.toHaveBeenCalled();
    });
    
    it("should have called require twice", function(){
      expect(require).toHaveBeenCalledThrice();
    });
    
    it("should have first requested dummyVM", function(){
      expect(require.firstCall.args[0]).toEqual(['dummyVM']);
    });
    
    it("should have second requested nestedVM", function(){
      expect(require.secondCall.args[0]).toEqual(['nestedVM']);
    });
    
    it("should have third requested nestedVM again", function(){
      expect(require.thirdCall.args[0]).toEqual(['nestedVM']);
    });
  });
  
  describe("and the nested viewmodel has been loaded with a model", function(){
    
    var elm;
    
    beforeEach(function(done){
      function NestedVM(){
        nestedVM.apply(this, arguments);
        setTimeout(done,1);
      }

      require.withArgs(['nestedVM']).callsArgWith(1, NestedVM);
      
      elm = an_element.withNestedViewModel("dummyVM", "nestedVM", model);
      applyViewModels(elm, subscribe);
    });
    
    it("should now have found the nested viewmodels", function(){
      expect(nestedVM).toHaveBeenCalled();
    });

    it("should call the nested viewmodel with the model as the first argument", function(){
      expect(nestedVM.firstCall.args[0]).toEqual(model);
    });

    it("should call the nested viewmodel with the subWhenContext function as the second argument", function(){
      expect(nestedVM.firstCall.args[1]).toEqual(subWhenContext);
    });

    it("should have access to the parent context", function(){
      expect(elm.firstChild.firstChild.textContent).toBe("dummyText");
    });
    
    describe("when the nested element is destroyed", function(){
      
      beforeEach(function(){
        ko.cleanNode(elm.firstChild.firstChild);
      });
      
      it("should destroy the when context", function(){
        expect(parentContext.destroyChildContexts).toHaveBeenCalledOnce();
      });
    });
  });
  
  describe("and the nested viewmodel has been loaded with params", function(){
    
    var elm;
    
    beforeEach(function(done){
      function NestedVM(){
        nestedVM.apply(this, arguments);
        setTimeout(done, 1);
      }
            
      require.withArgs(['nestedVM']).callsArgWith(1, NestedVM);
      
      elm = an_element.withNestedViewModelAndParams("dummyVM", "nestedVM", "something: value");

      applyViewModels(elm, subscribe);
    });
    
    it("should now have found the nested viewmodels", function(){
      expect(nestedVM).toHaveBeenCalled();
    });

    it("should call the nested viewmodel with the model as the first argument", function(){
      expect(nestedVM.firstCall.args[0].something).toBe("dummyText");
    });

    it("should call the nested viewmodel with the subWhenContext function as the second argument", function(){
      expect(nestedVM.firstCall.args[1]).toEqual(subWhenContext);
    });

    it("should have access to the parent context", function(){
      expect(elm.firstChild.firstChild.textContent).toBe("dummyText");
    });
    
    describe("when the nested element is destroyed", function(){
      
      beforeEach(function(){
        ko.cleanNode(elm.firstChild.firstChild);
      });
      
      it("should destroy the when context", function(){
        expect(parentContext.destroyChildContexts).toHaveBeenCalledOnce();
      });
    });
  });
});