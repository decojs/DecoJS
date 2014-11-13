describe("when never caching pages", {
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
      cachePages: false
    };

    pageLoader = new PageLoader(config);
    ajax.respondImmediately = false;

    because: {
      pageLoader.loadPage("path/to/never/cached/page");
    }
  });

  afterEach(function(){
    ajax.spy.reset();
    ajax.respondImmediately = true;
  });

  it("should add random numbers to the end of the url", function(){
    expect(ajax.spy.firstCall.args[0]).toMatch(/cacheKey=(\d+)/);
  });
});