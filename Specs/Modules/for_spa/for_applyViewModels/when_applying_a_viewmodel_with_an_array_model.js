describe("when applying a viewmodel with an array model", [
  "deco/spa/applyViewModels",
  "Given/an_element"
], function(
  applyViewModels,
  an_element
){

  var dummyVM,
    whenContext,
    model = [1, 2, 3];
  
  function DummyVM(){
    dummyVM(this, arguments);
  }

  beforeEach(function(done){

    whenContext = sinon.spy();
    var subscribe = sinon.stub().returns(whenContext);

    dummyVM = sinon.spy();

    define("dummyVM", [], function(){
      return DummyVM;
    });
    
    var elm = an_element.withAViewModel("dummyVM", model);

    because: {
      applyViewModels(elm, subscribe).then(done);
    }
  });

  afterEach(function(){
    require.undef("dummyVM");
  });

  it("should find all the viewmodels in the dom tree", function(){
    expect(dummyVM.callCount).toBe(1);
  });

  it("should call the viewmodule as a constructor", function(){
    expect(dummyVM.firstCall.args[0]).toBeA(DummyVM);
  });

  it("should call the viewmodule with the model as the first argument", function(){
    expect(dummyVM.firstCall.args[1][0]).toEqual(model);
  });

  it("should call the viewmodule with the subscribe function as the second argument", function(){
    expect(dummyVM.firstCall.args[1][1]).toEqual(whenContext);
  });
});