describe("when applying nested viewmodels", [
  "deco/spa/applyViewModels",
  "Given/an_element"
], function(
  applyViewModels,
  an_element
){

  var dummyVM,
    nestedVM,
    subscribe,
    model = {a: true};
  
  function DummyVM(){
    dummyVM(this, arguments);
  }
  function NestedVM(){
    nestedVM(this, arguments);
  }

  beforeEach(function(done){

    subscribe = sinon.spy();

    dummyVM = sinon.spy();
    nestedVM = sinon.spy();

    define("dummyVM", [], function(){
      return DummyVM;
    });
    
    define("nestedVM", [], function(){
      return NestedVM;
    });
    
    var elm = an_element.withNestedViewModel("dummyVM", "nestedVM");

    because: {
      applyViewModels(elm, subscribe).then(done);
    }
  });

  afterEach(function(){
    require.undef("dummyVM");
    require.undef("nestedVM");
  });

  it("should find only the top level viewmodels in the dom tree", function(){
    expect(dummyVM.callCount).toBe(1);
  });
  
  it("should not find the nested viewmodels", function(){
    expect(nestedVM.callCount).toBe(0);
  });
});