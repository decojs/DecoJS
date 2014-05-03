describe("when applying a viewmodel without a model", [
  "deco/spa/applyViewModels",
  "Given/an_element"
], function(
  applyViewModels,
  an_element
){


  var dummyVM,
    subscribe,
    model = null;

  beforeEach(function(done){

    subscribe = sinon.spy();

    dummyVM = sinon.spy();

    define("dummyVM", [], function(){
      return function DummyVM(){
        dummyVM(this, arguments);
      };
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

  it("should call the viewmodule with an empty model as the first argument", function(){
    expect(dummyVM.firstCall.args[1][0]).toEqual({});
  });

  it("should call the viewmodule with the subscribe function as the second argument", function(){
    expect(dummyVM.firstCall.args[1][1]).toEqual(subscribe);
  });
});