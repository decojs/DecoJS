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
    promise,
    pathToUrlSpy;

  beforeEach(function(){

    pathToUrlSpy = sinon.spy();

    var config = {
      pathToUrl: pathToUrlSpy
    };

    pageLoader = new PageLoader(config);
    ajax.respondImmediately = false;

    because: {
      promise = pageLoader.loadPage("path/to/page");
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

    var resolve = sinon.spy();
    
    because(function(done){
      ajax.callback({
        status: 200,
        responseText: "myTemplate"
      });
      
      promise.then(resolve).then(done);
    });

    it("the promise should resolve", function(){
      expect(resolve.callCount).toBe(1);
    });
    it("the promise should resolve with the page content", function(){
      expect(resolve.firstCall.args[0]).toBe("myTemplate");
    });
  });

  describe("when the server responds with a 404", function(){
    
    var reject = sinon.spy();
    
    because(function(done){
      ajax.callback({
        status: 404,
        responseText: "myTemplate"
      });
      
      promise['catch'](reject).then(done);
    });

    it("the promise should be rejected", function(){
      expect(reject.callCount).toBe(1);
    });

    it("the promise should contain the error code", function(){
      expect(reject.firstCall.args[0].error).toBe(404);
    });
  });

  describe("when a new page is requetsed before the old one is resolved", function(){

    var reject = sinon.spy();
    
    because(function(done){
      pageLoader.loadPage("a/second/page");
      
      promise['catch'](reject).then(done);
    });

    it("the original promise should be rejected", function(){
      expect(reject.callCount).toBe(1);
    });
  });

  describe("when the loading is aborted", function(){

    var reject = sinon.spy();
    
    because(function(done){
      pageLoader.abort();
      promise['catch'](reject).then(done);
    });

    it("the original promise should be rejected", function(){
      expect(reject.callCount).toBe(1);
    });
  });
});