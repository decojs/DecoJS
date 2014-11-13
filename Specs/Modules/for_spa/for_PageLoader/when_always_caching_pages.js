describe("when always caching pages", {
  "deco/ajax": "Mocks/ajaxMock"
},[
  "deco/spa/PageLoader",
  "deco/ajax"
], function(
  PageLoader,
  ajax
){

  var pageLoader;

  beforeEach(function(){

    var config = {
      cachePages: true
    };

    pageLoader = new PageLoader(config);
    ajax.respondImmediately = false;

    because: {
      pageLoader.loadPage("path/to/cached/page");
    }
  });

  afterEach(function(){
    ajax.spy.reset();
    ajax.respondImmediately = true;
  });

  it("should not add random numbers to the end of the url", function(){
    expect(ajax.spy.firstCall.args[0]).toBe("path/to/cached/page");
  });
});