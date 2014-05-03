describe("when loading a page", {
  "deco/ajax": "Mocks/ajaxMock"
},[
  "deco/spa/PageLoader",
  "deco/ajax"
], function(
  PageLoader,
  ajax
){

  var pageLoader,
    resolver,
    pathToUrlSpy;

  beforeEach(function(){

    pathToUrlSpy = sinon.spy();

    var config = {
      pathToUrl: pathToUrlSpy
    };

    pageLoader = new PageLoader(config);
    ajax.respondImmediately = false;

    resolver = {
      resolve: sinon.spy(),
      reject: sinon.spy()
    };

    because: {
      pageLoader.loadPage("path/to/page", resolver);
    }
  });

  afterEach(function(){
    ajax.spy.reset();
    ajax.respondImmediately = true;
  });

  it("should use the pathToUrl to get the correct url", function(){
    expect(pathToUrlSpy.callCount).toBe(1);
    expect(pathToUrlSpy.firstCall.args[0]).toBe("path/to/page");
  });

  it("should use ajax to get the page", function(){
    expect(ajax.spy.callCount).toBe(1);
  });

  describe("when the server responds", function(){

    because(function(){
      ajax.callback({
        status: 200,
        responseText: "myTemplate"
      });
    });

    it("the promise should resolve", function(){
      expect(resolver.resolve.callCount).toBe(1);
    });
    it("the promise should resolve with the page content", function(){
      expect(resolver.resolve.firstCall.args[0]).toBe("myTemplate");
    });
  });

  describe("when the server responds with a 404", function(){

    because(function(){
      ajax.callback({
        status: 404,
        responseText: "myTemplate"
      });
    });

    it("the promise should be rejected", function(){
      expect(resolver.reject.callCount).toBe(1);
    });

    it("the promise should contain the error code", function(){
      expect(resolver.reject.firstCall.args[0].error).toBe(404);
    });
  });

  describe("when a new page is requetsed before the old one is resolved", function(){

    because(function(){
      pageLoader.loadPage("a/second/page");
    });

    it("the original promise should be rejected", function(){
      expect(resolver.reject.callCount).toBe(1);
    });
  });

  describe("when the loading is aborted", function(){

    because(function(){
      pageLoader.abort();
    });

    it("the original promise should be rejected", function(){
      expect(resolver.reject.callCount).toBe(1);
    });
  });
});