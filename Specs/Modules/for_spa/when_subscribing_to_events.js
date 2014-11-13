describe("when subscribing to events", {
  "deco/spa/hashNavigation": "Mocks/hashNavigationMock",
  "deco/spa/Outlet": "Mocks/OutletMock",
  "deco/spa/PageLoader":"Mocks/PageLoaderMock"
},[
  "deco/spa",
  "Given/an_element",
  "Given/an_event",
  "deco/spa/hashNavigation",
  "deco/spa/PageLoader"
], function(
  spa,
  an_element,
  an_event,
  hashNavigationMock,
  pageLoaderMock
){

  var event,
    react;

  beforeEach(function(done){
    
    pageLoaderMock.loadPageSpy.returns(Promise.resolve());
    
    var doc = an_element.withAViewModel("dummyVM");

    event = an_event.withNoParams();
    react = sinon.spy();

    define("dummyVM", [], function(){
      return function DummyVM(model, when){
        when(event, react);
      };
    });

    
    spa.start({}, doc).then(done);
  });

  afterEach(function(){
    require.undef("dummyVM");
  });

  describe("when the event is triggered", function(){

    because(function(){
      event();
    });

    it("should react when the event is triggered", function(){
      expect(react.callCount).toBe(1);
    });
  });

  describe("when the page changes", function(){

    beforeEach(function(){
      hashNavigationMock.navigateToPage("some/path");
      event();
    });

    it("should still react to the event", function(){
      expect(react.callCount).toBe(1);
    });

  });

});