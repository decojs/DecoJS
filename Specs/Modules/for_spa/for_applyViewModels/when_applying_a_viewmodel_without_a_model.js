describe("when applying a viewmodel without a model", [
  "deco/spa/applyViewModels",
  "Given/an_element"
], function(
  applyViewModels,
  an_element
){


  var dummyVM,
    whenContext,
    model = null;

  beforeEach(function(done){

    whenContext = sinon.spy();
    var subscribe = sinon.stub().returns(whenContext);

    dummyVM = sinon.spy();

    define("dummyVM", [], function(){
      return function DummyVM(){
        dummyVM.apply(this, arguments);
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
    expect(dummyVM).toHaveBeenCalled(1);
  });

  it("should call the viewmodule with nothing as the first argument", function(){
    expect(dummyVM).toHaveBeenCalledWith(undefined);
  });

  it("should call the viewmodule with the subscribe function as the second argument", function(){
    expect(dummyVM).toHaveBeenCalledWith(undefined, whenContext);
  });
});